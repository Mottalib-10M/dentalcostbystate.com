#!/usr/bin/env python3
"""Builds src/data/states.json, the data asset of the site, from two public sources.

1. data/fees/<ST>.json: the CDT codes read in each state's Medicaid dental fee-for-service schedule (one file
   per state, written from the official document, with its URL, title and effective date): the schedule in
   force today ("fees") and the one in force on July 1, 2024 ("fees_2024"), the date up to which the ADA
   collected the Medicaid fees behind its ratios. Estimates divide the 2024 fees; a state without a 2024
   schedule is listed with today's Medicaid fees only, never priced. Raw PDFs and spreadsheets stay outside
   the repository. data/fees-overrides.json: corrections read in the same documents (a multiplier printed in
   the schedule's header, codes paid on another basis), each with its reason.
2. The ADA Health Policy Institute workbook "Medicaid Fee-For-Service Reimbursement as a Percentage of Dentist
   Charges and Private Dental Insurance Reimbursement, 2024" (published October 2024), downloaded here.

Usage:  python3 scripts/build-data.py            (downloads the ADA workbook into .cache/ if missing)
Needs:  openpyxl (python3 -m venv .venv && .venv/bin/pip install openpyxl)
"""
import json, os, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ADA_URL = 'https://www.ada.org/-/media/project/ada-organization/ada/ada-org/files/resources/research/hpi/hpidata_medicaid_reimbursement_2024.xlsx'
CACHE = os.path.join(ROOT, '.cache')
NAMES = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut',
    'DE': 'Delaware', 'DC': 'District of Columbia', 'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois',
    'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri', 'MT': 'Montana',
    'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
    'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania',
    'RI': 'Rhode Island', 'SC': 'South Carolina', 'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
    'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
}
BY_NAME = {v: k for k, v in NAMES.items()}
slug = lambda name: re.sub(r'[^a-z]+', '-', name.lower()).strip('-')


def ada():
    import openpyxl
    os.makedirs(CACHE, exist_ok=True)
    f = os.path.join(CACHE, 'hpidata_medicaid_reimbursement_2024.xlsx')
    if not os.path.exists(f):
        req = urllib.request.Request(ADA_URL, headers={'User-Agent': 'Mozilla/5.0 (Macintosh) Chrome/129.0'})
        open(f, 'wb').write(urllib.request.urlopen(req).read())
    ws = openpyxl.load_workbook(f, data_only=True)['Medicaid FFS Reimbursement']
    out, nat = {}, None
    for row in ws.iter_rows(values_only=True):
        name = row[1]
        if not isinstance(name, str) or not isinstance(row[2], (int, float)):
            continue
        r = lambda x: round(x, 4) if isinstance(x, (int, float)) else None
        rec = {'childCharge': r(row[2]), 'adultCharge': r(row[3]), 'childPrivate': r(row[4]), 'adultPrivate': r(row[5]), 'adultBenefit': row[6]}
        if name == 'United States':
            nat = rec
        elif name in BY_NAME:
            out[BY_NAME[name]] = rec
    assert len(out) == 51 and nat, (len(out), nat)
    return out, nat


def clean(fees, mult=1.0, drop=()):
    out = {}
    for k, v in (fees or {}).items():
        if k in drop:
            continue
        v = {p: round(float(x) * mult, 2) for p, x in v.items() if isinstance(x, (int, float)) and x > 0}
        if v:
            out[k] = v
    return out


def main():
    ratios, nat = ada()
    states = []
    ov_path = os.path.join(ROOT, 'data', 'fees-overrides.json')
    overrides = json.load(open(ov_path)) if os.path.exists(ov_path) else {}
    fdir = os.path.join(ROOT, 'data', 'fees')
    for fn in sorted(os.listdir(fdir)):
        if not fn.endswith('.json'):
            continue
        d = json.load(open(os.path.join(fdir, fn)))
        # A state whose current schedule is out of reach is still priced from its July 2024 schedule.
        if d.get('status') != 'ok' and not d.get('fees_2024'):
            continue
        if d.get('status') != 'ok':
            d['fees'], d['source_url'] = {}, d['source_url_2024']
            d['effective_date'] = d['effective_date_2024']
            d['document_title'] = d.get('title_2024') or f"{NAMES[d['state']]} Medicaid dental fees in force on July 1, 2024"
        code = d['state']
        o = overrides.get(code, {})
        if o.get('exclude'):
            continue
        mult, drop = o.get('multiplier', 1.0), o.get('drop', [])
        mult24 = o.get('multiplier_2024', mult)
        now = clean(d['fees'], mult, drop)
        if d.get('fees_2024'):
            f24, src24, eff24 = clean(d['fees_2024'], mult24, drop), d.get('source_url_2024') or d['source_url'], d.get('effective_date_2024')
        elif d['effective_date'] <= '2024-07-01':
            f24, src24, eff24 = now, d['source_url'], d['effective_date']
        else:
            f24, src24, eff24 = {}, None, None
        eff24 = o.get('effective_2024', eff24)
        # Two documents for one state (Louisiana: children and adults) are joined by ' ; ': the first one is linked.
        # A URL followed by a comment ("(via Wayback capture ...)"): the official address alone is kept.
        first = lambda u: re.match(r'https?://\S+', u).group(0) if u else u
        src24, d['source_url'] = first(src24), first(d['source_url'])
        r = ratios[code]
        states.append({
            'code': code, 'name': NAMES[code], 'slug': slug(NAMES[code]),
            'program': d['program'], 'title': d['document_title'], 'url': d['source_url'], 'page': d['source_page'],
            'effective': d['effective_date'], 'retrieved': d['retrieved_at'], 'notes': d.get('notes', ''),
            'url2024': src24, 'effective2024': eff24, 'notes2024': d.get('notes_2024', ''), 'override': o.get('reason', ''),
            'ratios': {k: r[k] for k in ('childCharge', 'adultCharge', 'childPrivate', 'adultPrivate')},
            'adultBenefit': r['adultBenefit'], 'fees': f24, 'feesNow': now,
        })
    allr = [{'code': c, 'name': NAMES[c], **{k: v for k, v in r.items()}} for c, r in sorted(ratios.items(), key=lambda x: NAMES[x[0]])]
    json.dump(states, open(os.path.join(ROOT, 'src', 'data', 'states.json'), 'w'), indent=1)
    json.dump({'national': nat, 'states': allr}, open(os.path.join(ROOT, 'src', 'data', 'ada-ratios-2024.json'), 'w'), indent=1)
    print(f'{len(states)} states with a fee schedule ({sum(1 for x in states if x["fees"])} with the 2024 one), ADA ratios for {len(allr)} states + national')


if __name__ == '__main__':
    main()
