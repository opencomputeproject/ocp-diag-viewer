# OCP Diag Result Viewer

OCP Diag Result Viewer can be used as a
1. Local web server
2. CLI tool
3. Web service with customized hosting (currently supporting Google Cloud Storage)

## How to run the local web server
1. Make sure you have both ```npm``` and ```pdm``` installed
2. Run ```pdm install``` to install dependencies
3. Run ```pdm run server```
4. Open the link shown in the terminal (should be http://127.0.0.1:5000)

Local web server uses local storage to save files. To upload your data to a permanent remote storage, see [How to integrate with your own Google Cloud Storage](#how-to-integrate-with-your-own-google-cloud-storage)


## Using the local server
1. On the home page, you will see a form to directly upload a local file. If the file is of valid OCP format, the view will redirect to the HTML page presenting the test results
2. To upload a remote file using absolute URL
Append the absolute encoded URL of the remote file to the parameter ```file``` in the GET request
```http://127.0.0.1:5000/upload?file=[encoded_url_to_file]```

## How to compile the CLI binary on local machine
1. Make sure you have both ```npm``` and ```pdm``` installed
2. Run ```pdm install``` to install dependencies
3. Run ```pdm run frontend-build```
4. Run ```pdm run client-build```
5. The binary should be compiled at ./bin/ocp-diag-result-viewer

## Using the binary CLI
1. Save a result as an html file
```shell
$ ./bin/ocp-diag-result-viewer html test.output -o test.html
```

3. Display logs in table format
```shell
$ ./bin/ocp-diag-result-viewer log test.output
```
```shell
Seq Num | Timestamp                      | Severity   | Stage   | Name          | Category    | Message
--------+--------------------------------+------------+---------+---------------+-------------+----------------------------------
      0 | 2021-11-29T05:52:21.879371116Z | INFO       | Run     |               | Start       | text 
      1 | 2021-11-29T05:52:21.881564737Z | INFO       | Step 1  | Step 1        | Measurement | text
      2 | 2021-11-29T05:52:21.881880783Z | INFO       | Step 2  | Step 2        | Diagnosis   | [PASS] test passed
```

## How to integrate with your own Google Cloud Storage

### Using the ```config.toml``` file
You can uncomment the contents in the ```config.toml``` file and add your own GCS bucket names and other variables like source location maps and allowed domains.

### Using Google Cloud Storage [Secret Manager](https://cloud.google.com/security/products/secret-manager)

The same contents in the ```config.toml``` file can be put into a secret file. This abstracts out your organization's internal details from the public.
To fetch the secret, you need to set 2 environment variables: your GCS project name and the name of your secret.
<i><b>Note: To make sure OCP Diag Result Viewer uses your GCS configurations, make sure to delete the ```config.toml``` file.</b></i>
```shell
GOOGLE_CLOUD_PROJECT="project-ABC" GOOGLE_CLOUD_SECRET_NAME="secret_name" pdm run server
```

<i><b>Note: You need to run ```gcloud auth application-default login``` first for this method to work</b></i>

## Future works
* Support more storage options eg. AWS

## Contact
For bug reports/feedback/future request, please send an email to nguyentv@google.com