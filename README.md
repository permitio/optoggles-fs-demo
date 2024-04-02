# optoggles-fs-demo

To run the demo, execute the following command:
```shell
docker-compose up -d --build
```

1. Access http://localhost:3000
2. `eve` should have the `us-feature` by default and `bob` should have the `billing-feature` by default.
3. To disable the `us-feature` for `eve`, run the following command:
    ```shell
    opal-client publish-data-update --src-url 'http://backend:8081/attributes?result={"location":{"country":"EU"}}' -t policy_data --dst-path /policy/users/eve/attributes
    ```
4. To enable the `us-feature` for `eve`, run the following command:
    ```shell
    opal-client publish-data-update --src-url 'http://backend:8081/attributes?result={"location":{"country":"US"}}' -t policy_data --dst-path /policy/users/eve/attributes
    ```
5. To disable `billing-feature` for `bob`, run the following command:
   To disable the billing-feature for a user run the following command:
   ```shell
   opal-client publish-data-update --src-url 'http://backend:8081/roles?exclude_billing=true' -t policy_data --dst-path /policy/users/bob/roles
   ```
6. To enable `billing-feature` for `bob`, run the following command:
   ```shell
   opal-client publish-data-update --src-url 'http://backend:8081/roles?exclude_billing=false' -t policy_data --dst-path /policy/users/bob/roles
   ```
