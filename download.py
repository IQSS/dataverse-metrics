import json
import ssl
import sys
import os
from datetime import datetime, date
import calendar
try:
    import urllib.request as urlrequest
except ImportError:
    import urllib as urlrequest
try:
    from urllib.parse import urlparse
except ImportError:
    from urlparse import urlparse


def main():
    with open('config.json') as config_file:
        config = json.load(config_file)

    installations = config['installations']
    api_response_cache_dir = config['api_response_cache_dir']
    num_months_to_process = config['num_months_to_process']
    monthly_endpoints = config['endpoints']['monthly']
    single_endpoints = config['endpoints']['single']
    monthly_itemized_endpoints = config['endpoints']['monthly_itemized']
    github_repos = config.get('github_repos')

    # trust SSL certificates
    ssl._create_default_https_context = ssl._create_unverified_context

    for installation in installations:
        try:
            process_monthly_endpoints(installation, monthly_endpoints, api_response_cache_dir, num_months_to_process)
            # "monthly itemized" metrics are downloaded the same way as regular montly metrics:
            process_monthly_endpoints(installation, monthly_itemized_endpoints, api_response_cache_dir, num_months_to_process)
            process_single_endpoints(installation, single_endpoints, api_response_cache_dir)
        except Exception as e:
            print("processing " + installation + " failed: " + str(e))

        if github_repos:
            for repo in github_repos:
                process_github_repo(repo, api_response_cache_dir)


def process_monthly_endpoints(installation, monthly_endpoints, api_response_cache_dir, num_months_to_process):
    for endpoint in monthly_endpoints:
        process_monthly_endpoint(installation, endpoint, api_response_cache_dir, num_months_to_process)


def process_monthly_endpoint(installation, endpoint, api_response_cache_dir, num_months_to_process):
    for month in get_months(num_months_to_process):
        url = installation + '/api/info/metrics/' + endpoint + '/' + month
        path = api_response_cache_dir + '/' + endpoint + '/' + month
        if not os.path.exists(path):
            os.makedirs(path)
        try: 
            response = urlrequest.urlopen(url)
        except: 
            # assume that this endpoint is not supported by this (older) Dataverse instance - skip quietly (?)
            break
        json_out = get_remote_json(response)
        o = urlparse(installation)
        hostname = o.hostname
        filename = hostname + '.json'
        with open(path + '/' + filename, 'w') as outfile:
            json.dump(json_out, outfile, indent=4)


def get_months(num_months_to_process):
    months = []
    today = datetime.today()
    for i in range(num_months_to_process):
        months.append(subtract_months(today, i).strftime('%Y-%m'))
    return months


# variation of https://stackoverflow.com/questions/4130922/how-to-increment-datetime-by-custom-months-in-python-without-using-library/4131114#4131114
def subtract_months(sourcedate, months):
    month = sourcedate.month - 1 - months
    year = sourcedate.year + month // 12
    month = month % 12 + 1
    day = min(sourcedate.day, calendar.monthrange(year, month)[1])
    return date(year, month, day)


def get_remote_json(response):
    if sys.version_info > (3, 0, 0):
        return json.loads(response.read().decode(response.info().get_param('charset') or 'utf-8'))
    else:
        return json.loads(response.read())


def process_single_endpoints(installation, single_endpoints, api_response_cache_dir):
    for endpoint in single_endpoints:
        try:
           process_single_endpoint(installation, endpoint, api_response_cache_dir)
        except Exception as e:
           print(installation + '/api/info/metrics/' + endpoint + ' failed: ' + str(e))


def process_single_endpoint(installation, endpoint, api_response_cache_dir):
    url = installation + '/api/info/metrics/' + endpoint
    try:
        response = urlrequest.urlopen(url)
    except Exception as e:
        print(installation + " had an oops: " + str(e))
    json_out = get_remote_json(response)
    o = urlparse(installation)
    hostname = o.hostname
    path = api_response_cache_dir + '/' + endpoint
    if not os.path.exists(path):
        os.makedirs(path)
    filename = hostname + '.json'
    with open(path + '/' + filename, 'w') as outfile:
        json.dump(json_out, outfile, indent=4)

def process_github_repo(repo, api_response_cache_dir):
    o = urlparse(repo)
    path = o.path
    owner = path.split('/')[1]
    repo = path.split('/')[2]
    url = 'https://api.github.com/repos/' + owner + '/' + repo + '/stats/contributors'
    try:
        response = urlrequest.urlopen(url)
    except Exception as e:
        # For Python 2 compatibility, handle errors later when calling get_remote_json
        pass
    try:
        json_out = get_remote_json(response)
    except Exception as e:
        sys.stderr.write('Unable to retrieve JSON from ' + url + '\n')
        return
    path = api_response_cache_dir + '/' + "contributors" + '/' + "github.com" + '/' + owner + '/' + repo
    if not os.path.exists(path):
        os.makedirs(path)
    filename = 'contributors.json'
    with open(path + '/' + filename, 'w') as outfile:
        json.dump(json_out, outfile, indent=4)


if __name__ == '__main__':
    main()
