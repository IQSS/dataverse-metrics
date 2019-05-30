# dataverse-metrics

## Introduction

dataverse-metrics aggregates metrics from multiple Dataverse installations and visualizes them on a web page.

dataverse-metrics was designed to aggregate metrics across all installations of Dataverse around the world, but can also be configured for a single installation of Dataverse. It makes use of the Dataverse [Metrics API][] that was added in Dataverse 4.9.

## Requirements

- Python 2 or Python 3
- Apache web server or similar
- a web browser

## Installation

### Put code into place

Change to the parent directory for where you will install dataverse-metrics. `/var/www/html` is the default "DocumentRoot" for Apache on CentOS (defined in `/etc/httpd/conf/httpd.conf`) and is suggested as a place to install dataverse-metrics, but you are welcome to install it wherever you want and use any server you want.

    cd /var/www/html

Clone the repo:

    git clone https://github.com/IQSS/dataverse-metrics.git

Change to the directory you just created by cloning the repo:

    cd dataverse-metrics

### Configuration

Copy `config.json.sample` to `config.json` and edit the following values:

- `installations`: An array of Dataverse installation URLs.
- `api_response_cache_dir`: Fully qualified directory where JSON files representing API responses will be stored.
- `aggregate_output_dir`: Fully qualified directory where TSV output files of aggregated metrics will be stored.
- `num_months_to_process`: For monthly metrics, the number of months to go back in time to download metrics from each Dataverse installation.
- `endpoints`: An array of Metrics API endpoints to process. Note that the two types are `single` (i.e. `datasets/bySubject`) and `monthly` (i.e. `downloads/toMonth`). (You will notice a third type called `monthly_itemized` in `config.json.sample` but it is not yet supported.)
- `blacklists`: Arrays of terms to blacklist. Only the `datasets/bySubject` endpoint can have a blacklist.
- `colors`: A single color for bar charts and a palette of colors for tree maps.
- `github_repos`: An array of GitHub repos such as `https://github.com/IQSS/dataverse`. A line will be added per repo about the number of contributors.

### Aggregating metrics

Now that your `config.json` file is ready, run the `metrics.py` script to create a TSV file for each of the `endpoints` and a `contributors.json` file for the `github_repos`, all of which will be placed in the `aggregate_output_dir` directory:

    python3 metrics.py

(Please note that if you don't have Python 3 installed, Python 2 should work fine too but Python 3 is highly recommended because Python 2 will not be maintained past January 1, 2020 according to https://pythonclock.org and [PEP 373][].)

### Viewing the visualizations

Using the instructions above, index.html has been placed at /var/www/html/dataverse-metrics/index.html and should be available on your Apache server at http://example.com/dataverse-metrics/index.html

### Adding additional installations

The list of Dataverse installations depends on `all-dataverse-installations.json` which can be updated with the following script as new installations are added to the [map][] produced by [miniverse][]:

    ./update-all-installations-list.sh

### Updating Metrics

To update your metrics periodically, you'll want to queue up a shell script in some flavor of [cron][].

Here's an [example shell script](update_metrics.sh) to get you started.

On a Red Hat or CentOS system, you might drop a file like [update_metrics.cron](update_metrics.cron) into /etc/cron.d/ to update on a specified schedule.

## Contributing

We love contributors! Please see our [Contributing Guide][] for ways you can help and check out the to do list below.

## To Do

- Drop support for Python 2. See https://python3statement.org

[![Build Status](https://travis-ci.org/IQSS/dataverse-metrics.svg?branch=master)](https://travis-ci.org/IQSS/dataverse-metrics)

[Metrics API]: http://guides.dataverse.org/en/latest/api/metrics.html
[map]: https://dataverse.org
[miniverse]: https://github.com/IQSS/miniverse
[cron]: https://en.wikipedia.org/wiki/Cron
[Contributing Guide]: CONTRIBUTING.md
[PEP 373]: https://www.python.org/dev/peps/pep-0373/
