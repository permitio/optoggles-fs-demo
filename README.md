# optoggles-fs-demo

This demo shows how to use OPToggles with a feature toggling system (LaunchDarkly) to sync 
Policy as Code results to the feature toggling system.
It can be modified to use any feature toggling system as OPToggles supports any 
Generic Rest API calls.

Before you run the demo, you need to configure the following:
1. CLIENT_ENV_KEY - inside the `frontend/App.js` file, we use this key to interact with LaunchDarkly. 
   You can configure this inside the `docker-compose.yaml` file.
2. launchdarklyToken - OPToggles requires this token in order to interact with LaunchDarkly, without this token,
   OPToggles won't be able to sync Policy as Code results to the feature toggling system.
    You can configure this inside the `policy/launchdarkly-config.yaml` file.

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
   ```shell
   opal-client publish-data-update --src-url 'http://backend:8081/roles?exclude_billing=true' -t policy_data --dst-path /policy/users/bob/roles
   ```
6. To enable `billing-feature` for `bob`, run the following command:
   ```shell
   opal-client publish-data-update --src-url 'http://backend:8081/roles?exclude_billing=false' -t policy_data --dst-path /policy/users/bob/roles
   ```
