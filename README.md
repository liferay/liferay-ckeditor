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
