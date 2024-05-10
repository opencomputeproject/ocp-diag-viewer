# OCP Diag Result Viewer

## Run the local web server
1. Make sure you have both ```npm``` and ```pdm``` installed
2. Run ```pdm install``` to install dependencies
3. Run ```pdm run server```
4. Open the link shown in the terminal (should be http://127.0.0.1:5000)

## Compile and run the binary cli
1. Make sure you have both ```npm``` and ```pdm``` installed
2. Run ```pdm install``` to install dependencies
3. Run ```pdm run frontend-build```
4. Run ```pdm run client-build```
5. The binary should be compiled at ./bin/ocp-diag-result-viewer

## Using the binary cli
1. Upload a test result to web service
```shell
$ ocp-diag-result-viewer share meltan.out
https://meltan-380203.de.r.appspot.com/view/123456789
```

2. Save a result as an html file
```shell
$ ocp-diag-result-viewer html test.output -o test.html
```

3. Display logs in table format
```shell
$ ocp-diag-result-viewer log test.output
```
```shell
Seq Num | Timestamp                      | Severity   | Stage   | Name          | Category    | Message
--------+--------------------------------+------------+---------+---------------+-------------+----------------------------------
      0 | 2021-11-29T05:52:21.879371116Z | INFO       | Run     |               | Start       | text 
      1 | 2021-11-29T05:52:21.881564737Z | INFO       | Step 1  | Step 1        | Measurement | text
      2 | 2021-11-29T05:52:21.881880783Z | INFO       | Step 2  | Step 2        | Diagnosis   | [PASS] test passed
```


## Deploy to Google App Engine
1. Run ```pdm run gae-deploy```
2. Open the link shown in the terminal (should be https://meltan-380203.de.r.appspot.com/)

## Using the Web service
1. To view an already uploaded test result
```https://meltan-380203.de.r.appspot.com/view/[hash_id]```
2. To upload a local test result file
Just open ```https://meltan-380203.de.r.appspot.com/``` and you will see a form to upload a file
3. To upload a remote file using absolute URL
Append the absolute encoded URL of the remote file to the parameter ```file``` in the GET request
```https://meltan-380203.de.r.appspot.com/upload?file=[encoded_url_to_file]```