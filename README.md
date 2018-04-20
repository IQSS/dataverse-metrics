# metrics.dataverse.org

https://dataverse.org/metrics only shows metrics for Harvard Dataverse but our goal is to show metrics for all installations of Dataverse around the world that are interested in displaying them.

The plan is to have the Dataverse software expose metrics via API as JSON and this effort is being tracked at https://github.com/IQSS/dataverse/issues/4527

Once some Dataverse installations have been upgraded to a version that supports metrics, we can start to use the code in this repo host a service that aggregates metrics across various Dataverse installations.

Please note that as of this writing the code in this repo can only be pointed at a single installation of Dataverse. The plan is to transition it to support multiple installations.
