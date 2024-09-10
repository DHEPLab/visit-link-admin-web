# Visit Link Admin Frontend

![main workflow](https://github.com/DHEPLab/visit-link-admin-web/actions/workflows/ci.yml/badge.svg)

## Local Development

NodeJS Version v20 LTS

```
$ yarn
$ yarn start
```

By default the app will proxy all the api to localhost:8080, you can change the target by running with `BACKEND_PROXY_TARGET` env variable.
```shell
$ BACKEND_PROXY_TARGET=<url> yarn start
```

You can also use the `serve` script to running as production preview mode:
```shell
$ BACKEND_PROXY_TARGET=<url> yarn serve
```

### Storybook Preview
We customized the antd theme to match our visual design, start storybook preview with `yarn storybook`

## External Dependencies

The visit-link-backend service, with reverse proxy configuration in vite.config.ts

