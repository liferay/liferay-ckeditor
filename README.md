# liferay-ckeditor

This repo contains tooling for maintaining Liferay's customized version of CKEditor.

## Structure

- A submodule at `ckeditor-dev` pointing at [the upstream CKEditor project](https://github.com/ckeditor/ckeditor4).
- [A `patches/` directory](https://github.com/liferay/liferay-ckeditor/tree/master/patches) containing Liferay-specific changes to be applied to the upstream.
- [A `ck.sh` script](https://github.com/liferay/liferay-ckeditor/blob/master/ck.sh) for setting up the project, creating/updating patches, and producing releases.
- [A `ckeditor` director](https://github.com/liferay/liferay-ckeditor/tree/master/ckeditor) containing the committed build artifacts.

For details on why we settled on this approach, please see issues [#7](https://github.com/liferay/liferay-ckeditor/issues/7) and [#16](https://github.com/liferay/liferay-ckeditor/issues/16), but in short, the desired attributes are:

- Make Liferay-specific patches easy to inspect by [aggregating them into a directory](https://github.com/liferay/liferay-ckeditor/tree/master/patches).
- Make changes in patches overtime obvious (by inspecting [their history](https://github.com/liferay/liferay-ckeditor/commits/master/patches)).
- Make changes in build artifacts obvious (again, bu inspecting [their history](https://github.com/liferay/liferay-ckeditor/commits/master/ckeditor)).

## How it works

- The `ckeditor-dev` submodule always points at the pristine (unmodified) upstream CKEditor repository, and specifically, at a release tag.
- `ck.sh setup` makes sure the submodule is up-to-date, creates a "liferay" branch inside it, and applies patches from the "patches/" directory to that branch.
- `ck.sh patch` freshens the contents of the "patches/" directory based on the current contents of the "liferay" branch in the submodule.
- `ck.sh update` updates to a requested version of CKEditor and rebases the contents of the "patches/" directory onto the new version.
- `ch.sh build` produces a build based on the current contents of the submodule, writing the files out to the "ckeditor/" directory.

## Common scenarios

With those basic operations in place, the most common workflows are described in the following sections:

- [Creating a new patch to CKEditor](#creating-a-new-patch-to-ckeditor)
- [Updating the base version of CKEditor](#updating-the-base-version-of-ckeditor)
- [Testing in liferay-portal](#testing-in-liferay-portal)
- [Publishing the liferay-ckeditor package to NPM](#publishing-the-liferay-ckeditor-package-to-npm)
- [Updating CKEditor in liferay-portal](#updating-ckeditor-in-liferay-portal)

### Creating a new patch to CKEditor

These are the steps you would follow to, for example, apply a workaround for a bug in the upstream project:

- Make sure you're update to date with the [superproject](https://github.com/liferay/liferay-ckeditor) repository:

      ```sh
      git pull origin master
      ```

- Set up everything to start working on a patch:

      ```sh
      sh ck.sh setup
      ```

- Work on your changes:

      `cd` into the `ckeditor-dev/` submodule and prepare your desired changes on the `liferay` branch.

      This could be `cherry-pick`ing a previously created commit or manually editing a file, so this can't be automated.

- Create your commit, add your changes and write a good commit message.

- Navigate back to the superproject's root directory and update the contents of the "patches/" directory:

      ```sh
      cd ..
      sh ck.sh patch
      ```

- Create a build of CKEditor containing the patches:

      From the root of the superproject's directory, run

      ```sh
      sh ck.sh build
      ```

  If you'd rather like a development build, for example for local debugging, use:

  ```sh
  DEBUG=1 ./ck.sh build
  ```

  **WARNING**: You should never publish development builds to the npm registry.

- Don't forget to add the changes and commit

### Updating the base version of CKEditor

To update the upstream CKEditor code to a new version, run:

```sh
./ck.sh update
```

A prompt will appear asking you which version you'd like to select. This will update the ckeditor-dev submodule to point at the corresponding commit.

**NOTE:** In order to prevent unintended commits to the submodule, using `ck.sh update` is the only supported way to change the commit the submodule is referencing. Git is configured to ignore changes to the submodule, so you will only see them in the output of commands like `git status`, `git show`, `git log -p` (etc) if you pass the `--ignore-submodules=none` switch.

### Testing in [liferay-portal](https://github.com/liferay/liferay-portal)

To test your local CKEditor build in liferay-portal:

1. Navigate to the [frontend-editor-ckeditor-web](https://github.com/liferay/liferay-portal/tree/master/modules/apps/frontend-editor/frontend-editor-ckeditor-web) module
2. Run `yarn add $PATH_TO_LOCAL_LIFERAY_CKEDITOR_REPO` (in Liferay DXP and Portal CE 7.2 and above), or `npm install $PATH_TO_LOCAL_LIFERAY_CKEDITOR_REPO` (in Liferay DXP and Portal CE versions prior to 7.2).
3. Re-deploy the module with `gradlew clean deploy`.

### Publishing the liferay-ckeditor package to NPM

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

#### Choosing a version number

For tagging and publishing `$VERSION` should be of the form `$CKEDITOR_VERSION-liferay.$RELEASE`. For example, "4.11.3-liferay.1"; that is:

- Based on CKEditor 4.11.3.
- Release number 1.

Subsequent releases would be "4.11.3-liferay.2", "4.11.3-liferay.3" and so on. When we update to CKEditor 4.11.4, we reset the suffix, so the release would be "4.11.4-liferay.1", "4.11.4-liferay.2" and so on.

**WARNING**: You should never publish development builds to the npm registry.

### Updating CKEditor in [liferay-portal](https://github.com/liferay/liferay-portal)

To update CKEditor in liferay-portal:

1. Navigate to the [frontend-editor-ckeditor-web](https://github.com/liferay/liferay-portal/tree/master/modules/apps/frontend-editor/frontend-editor-ckeditor-web) module
2. Update the `liferay-ckeditor` dependency in the `package.json` file
3. Re-deploy the module with `gradlew clean deploy`.

An example of this can be seen in [this](https://github.com/liferay/liferay-portal/commit/5b2ae3732d96f7f0dec6d35cb4de99f9d389c248) commit (look at the [`package.json`](https://github.com/liferay/liferay-portal/blob/5b2ae3732d96f7f0dec6d35cb4de99f9d389c248/modules/apps/frontend-editor/frontend-editor-ckeditor-web/package.json) file)
