import json
import os
import csv
import re

def main():
    with open('config.json') as config_file:
        config = json.load(config_file)

    api_response_cache_dir = config['api_response_cache_dir']
    aggregate_output_dir = config['aggregate_output_dir']
    monthly_endpoints = config['endpoints']['monthly']
    single_endpoints = config['endpoints']['single']
    monthly_itemized_endpoints = config['endpoints']['monthly_itemized']

    process_monthly_endpoints(monthly_endpoints, api_response_cache_dir, aggregate_output_dir)
    process_single_endpoints(single_endpoints, api_response_cache_dir, aggregate_output_dir)
    process_monthly_itemized_endpoints(monthly_itemized_endpoints, api_response_cache_dir, aggregate_output_dir)
    process_github_contributors(api_response_cache_dir, aggregate_output_dir)


def process_monthly_endpoints(monthly_endpoints, api_response_cache_dir, aggregate_output_dir):
    for endpoint in monthly_endpoints:
        datedir_parent = api_response_cache_dir + '/' + endpoint + '/'
        totals = {}
        for item in os.listdir(datedir_parent):
            if (re.match("^[0-9][0-9][0-9][0-9]\-[0-9][0-9]$", item) is not None):
                month = item
                datedir = datedir_parent + '/' + month
                for json_file in os.listdir(datedir):
                    path_and_json_file = datedir + '/' + json_file
                    with open(path_and_json_file) as f:
                        json_data = json.load(f)
                        count = json_data['data']['count']
                        last_count = totals.get(month, 0)
                        totals[month] = count + last_count
        metric_filename = endpoint.replace('/', '-') + '.tsv'
        path_and_metric_file = aggregate_output_dir + '/' + metric_filename
        with open(path_and_metric_file, 'w') as tsvfile:
            writer = csv.writer(tsvfile, delimiter='\t')
            writer.writerow(['month', 'count'])
            for month in sorted(totals):
                writer.writerow([month, totals[month]])


def process_single_endpoints(single_endpoints, api_response_cache_dir, aggregate_output_dir):
    for endpoint in single_endpoints:
        if endpoint == '../version':
            endpoint = 'version'
        jsondir = api_response_cache_dir + '/' + endpoint + '/'
        totals = {}
        for item in os.listdir(jsondir):
            if (re.match("^.*\.json$", item) is not None):
                json_file = item
                path_and_json_file = jsondir + '/' + json_file
                with open(path_and_json_file) as f:
                    json_data = json.load(f)
                    for name_and_count in json_data['data']:
                        if endpoint == 'dataverses/byCategory':
                            metric_type = 'category'
                        elif endpoint == 'version':
                            metric_type= 'version'
                        else:
                            metric_type = 'subject'
                        name = name_and_count[metric_type]
                        if endpoint== 'version':
                            if name[0] == 'V':
                                name=name[1:]
                            name = name.split('-')[0]    
                            count=1
                        else: 
                            count = name_and_count['count']
                        last_count = totals.get(name, 0)
                        totals[name] = count + last_count
        metric_filename = endpoint.replace('/', '-') + '.tsv'
        path_and_metric_file = aggregate_output_dir + '/' + metric_filename
        with open(path_and_metric_file, 'w') as tsvfile:
            writer = csv.writer(tsvfile, delimiter='\t')
            writer.writerow(['name', 'count'])
            for name in sorted(totals):
                writer.writerow([name, totals[name]])

def process_monthly_itemized_endpoints(monthly_itemized_endpoints, api_response_cache_dir, aggregate_output_dir):
    for endpoint in monthly_itemized_endpoints:
        datedir_parent = api_response_cache_dir + '/' + endpoint + '/'

        if endpoint == 'datasets/bySubject/toMonth':
            metric_type = 'subject'
        else:
            raise ValueError("Unexpected endpoint type: " + endpoint)

        metric_filename = endpoint.replace('/', '-') + '.tsv'
        path_and_metric_file = aggregate_output_dir + '/' + metric_filename
        with open(path_and_metric_file, 'w') as tsvfile:
            writer = csv.writer(tsvfile, delimiter='\t')
            writer.writerow(['month', 'name', 'count'])

            month_dirs = []
            for item in os.listdir(datedir_parent):
                if (re.match("^[0-9][0-9][0-9][0-9]\-[0-9][0-9]$", item) is not None):
                    month_dirs.append(item)

            for month in sorted(month_dirs):
                datedir = datedir_parent + '/' + month
                totals = {}

                for json_file in os.listdir(datedir):
                    path_and_json_file = datedir + '/' + json_file
                    with open(path_and_json_file) as f:
                        json_data = json.load(f)
                        for name_and_count in json_data['data']:
                            name = name_and_count[metric_type]
                            count = name_and_count['count']
                            last_count = totals.get(name, 0)
                            totals[name] = count + last_count
                for name in sorted(totals):
                    writer.writerow([month, name, totals[name]])


def process_github_contributors(api_response_cache_dir, aggregate_output_dir):
    github_dir = api_response_cache_dir + '/' + 'contributors' + '/' + 'github.com'
    contributors_by_repo = []
    for owner in os.listdir(github_dir):
        owner_dir = github_dir + '/' + owner
        for repo in os.listdir(owner_dir):
            ids, usernames, urls, avatars = [], [], [], []
            repo_url = 'https://github.com/' + owner + '/' + repo
            repo_dir = owner_dir + '/' + repo
            path_and_json_file = repo_dir + '/' + 'contributors.json'
            try:
                with open(path_and_json_file) as f:
                    json_data = json.load(f)
                    for contributor in json_data:
                        github_id = contributor['author']['id']
                        github_username = contributor['author']['login']
                        github_url = contributor['author']['html_url']
                        github_avatar = contributor['author']['avatar_url']
                        ids.append(github_id)
                        usernames.append(github_username)
                        urls.append(github_url)
                        avatars.append(github_avatar)

                contributors = [{"username": u, "url": url, "avatar": avatar, "id": gid} for u, url, avatar, gid in zip(usernames, urls, avatars, ids)]
                repo_info = {}
                repo_info['url'] = repo_url
                repo_info['contributors'] = contributors
                contributors_by_repo.append(repo_info)
            except FileNotFoundError:
                pass

    contributors_filename = 'contributors.json'
    with open(contributors_filename, 'w') as f:
        json.dump(contributors_by_repo, f, indent=4, ensure_ascii=True)


if __name__ == '__main__':
    main()
