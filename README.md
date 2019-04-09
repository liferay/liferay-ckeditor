# liferay-ckeditor

This is a fork of the [ckeditor-dev](https://github.com/ckeditor/ckeditor-dev) repository.


## Building

To build a production ready build, use:

```sh
./build-ckeditor.sh $VERSION
```

Where `$VERSION` is a valid [tag](https://github.com/ckeditor/ckeditor-dev/tags) in the CKEDITOR repository.

If you'd rather like a development build, for example for local debugging, use:

```sh
env DEBUG=1 ./build-ckeditor.sh $VERSION
```

The build files will be generated in the `ckeditor` directory.

**WARNING**: You should never publish development builds to the npm registry.

## Updating CKEditor in [liferay-portal](https://github.com/liferay/liferay-portal)

To update CKEditor in liferay-portal:

1. navigate to the [frontend-editor-ckeditor-web](https://github.com/liferay/liferay-portal/tree/master/modules/apps/frontend-editor/frontend-editor-ckeditor-web) module
2. update the `liferay-ckeditor` dependency in the `package.json` file
3. re-deploy the module with `gradlew clean deploy`.

An example of this can be seen in [this](https://github.com/liferay/liferay-portal/commit/5b2ae3732d96f7f0dec6d35cb4de99f9d389c248) commit (look at the [`package.json`](https://github.com/liferay/liferay-portal/blob/5b2ae3732d96f7f0dec6d35cb4de99f9d389c248/modules/apps/frontend-editor/frontend-editor-ckeditor-web/package.json) file)
