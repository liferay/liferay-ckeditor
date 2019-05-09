# liferay-ckeditor

This is a fork of the [ckeditor-dev](https://github.com/ckeditor/ckeditor-dev) repository.


## Building

To build a production-ready build, use:

```sh
./build-ckeditor.sh $CKEDITOR_VERSION
```

Where `$CKEDTIOR_VERSION` is a valid [tag](https://github.com/ckeditor/ckeditor-dev/tags) in the CKEDITOR repository, such as "4.11.3".

If you'd rather like a development build, for example for local debugging, use:

```sh
env DEBUG=1 ./build-ckeditor.sh $CKEDITOR_VERSION
```

The build files will be generated in the `ckeditor` directory.

**WARNING**: You should never publish development builds to the npm registry.

## Testing in [liferay-portal](https://github.com/liferay/liferay-portal)

To test your local CKEditor build in liferay-portal:

1. Navigate to the [frontend-editor-ckeditor-web](https://github.com/liferay/liferay-portal/tree/master/modules/apps/frontend-editor/frontend-editor-ckeditor-web) module
2. Run `yarn add $PATH_TO_LOCAL_LIFERAY_CKEDITOR_REPO`
3. Re-deploy the module with `gradlew clean deploy`.

## Publishing

After successfully building and testing you can publish to NPM.

```sh
# Confirm that worktree is clean and up-to-date.
git checkout master
git pull upstream master --ff-only
git status

# Bump the version number, creating a commit and tag.
# See below for notes on the format of the version number.
npm version $VERSION

# Sanity check what will be published.
npm publish --dry-run

# Publish to GitHub.
git push upstream master --follow-tags

# Publish to NPM.
npm publish
```
### Choosing a version number

For tagging and publishing `$VERSION` should be of the form `$CKEDITOR_VERSION-liferay.$RELEASE`. For example, "4.11.3-liferay.1"; that is:

- Based on CKEditor 4.11.3.
- Release number 1.

Subsequent releases would be "4.11.3-liferay.2", "4.11.3-liferay.3" and so on. When we update to CKEditor 4.11.4, we reset the suffix, so the release would be "4.11.4-liferay.1", "4.11.4-liferay.2" and so on.

**WARNING**: You should never publish development builds to the npm registry.

## Updating CKEditor in [liferay-portal](https://github.com/liferay/liferay-portal)

To update CKEditor in liferay-portal:

1. Navigate to the [frontend-editor-ckeditor-web](https://github.com/liferay/liferay-portal/tree/master/modules/apps/frontend-editor/frontend-editor-ckeditor-web) module
2. Update the `liferay-ckeditor` dependency in the `package.json` file
3. Re-deploy the module with `gradlew clean deploy`.

An example of this can be seen in [this](https://github.com/liferay/liferay-portal/commit/5b2ae3732d96f7f0dec6d35cb4de99f9d389c248) commit (look at the [`package.json`](https://github.com/liferay/liferay-portal/blob/5b2ae3732d96f7f0dec6d35cb4de99f9d389c248/modules/apps/frontend-editor/frontend-editor-ckeditor-web/package.json) file)

## Patching

1. Make sure you're update to date with the [superproject](https://github.com/liferay/liferay-ckeditor) repository:

	```sh
	git pull origin master
	```

2. Make sure the `ckeditor-dev` submodule is clean and up to date.

	```sh
  sh ./scripts/update.sh
  ```

3. Work on your changes:

	This could be `cherry-pick`ing a previously created commit or manually editing a file, so this can't be automated.

4. Create your commit, add your changes and write a good commit message.

5. Navigate back to the superproject's root directory and create the patch:

	```sh
	cd ..
	sh ./scripts/patch.sh
	```

7. Create a build of CKEditor containing the patches:

	From the root of the superproject's directory, run

	```sh
	sh ./scripts/build.sh
	```

8. Don't forget to add the changes and commit


