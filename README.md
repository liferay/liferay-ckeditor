# liferay-ckeditor

![](https://github.com/liferay/liferay-ckeditor/workflows/ci/badge.svg)

This repo contains tooling for maintaining Liferay's customized version of CKEditor.

## Structure

-   A submodule at `ckeditor-dev` pointing at [the upstream CKEditor project](https://github.com/ckeditor/ckeditor4).
-   [A `patches/` directory](https://github.com/liferay/liferay-ckeditor/tree/master/patches) containing Liferay-specific changes to be applied to the upstream.
-   [A `skins/` directory](https://github.com/liferay/liferay-ckeditor/tree/master/skins) containing custom skins.
-   [A `ck.sh` script](https://github.com/liferay/liferay-ckeditor/blob/master/ck.sh) for setting up the project, creating/updating patches, and producing releases.
-   [A `ckeditor` directory](https://github.com/liferay/liferay-ckeditor/tree/master/ckeditor) containing the committed build artifacts.

For details on why we settled on this approach, please see issues [#7](https://github.com/liferay/liferay-ckeditor/issues/7), [#16](https://github.com/liferay/liferay-ckeditor/issues/16) and [#66](https://github.com/liferay/liferay-ckeditor/issues/66) but in short, the desired attributes are:

-   Make Liferay-specific patches easy to inspect by [aggregating them into a directory](https://github.com/liferay/liferay-ckeditor/tree/master/patches).
-   Make changes in patches over time obvious (by inspecting [their history](https://github.com/liferay/liferay-ckeditor/commits/master/patches)).
-   Make changes in build artifacts obvious (again, but inspecting [their history](https://github.com/liferay/liferay-ckeditor/commits/master/ckeditor)).
-   Make possible to create [custom skins](https://github.com/liferay/liferay-ckeditor/tree/master/skins).

## How it works

-   The `ckeditor-dev` submodule always points at the pristine (unmodified) upstream CKEditor repository, and specifically, at a release tag.
-   `ck.sh setup` makes sure the submodule is up-to-date, creates a "liferay" branch inside it, and applies patches from the "patches/" directory to that branch.
-   `ck.sh patch` freshens the contents of the "patches/" directory based on the current contents of the "liferay" branch in the submodule.
-   `ck.sh update` updates to a requested version of CKEditor and rebases the contents of the "patches/" directory onto the new version.
-   `ck.sh build` produces a build based on the current contents of the submodule, writing the files out to the "ckeditor/" directory and committing the result.
-   `ck.sh createskin` creates a copy of CKEditor's `moono-lisa` base skin on `/skins` folder with the provided name.

## Common scenarios

With those basic operations in place, the most common workflows are described in the following sections:

-   [Creating a new patch to CKEditor](#creating-a-new-patch-to-ckeditor)
-   [Updating the base version of CKEditor](#updating-the-base-version-of-ckeditor)
-   [Testing in liferay-portal](#testing-in-liferay-portal)
-   [Publishing the liferay-ckeditor package to NPM](#publishing-the-liferay-ckeditor-package-to-npm)
-   [Updating CKEditor in liferay-portal](#updating-ckeditor-in-liferay-portal)
-   [Creating and building a custom skin](#creating-and-building-acustom-skin)

### Creating a new patch to CKEditor

These are the steps you would follow, for example, to apply a workaround for a bug in the upstream project:

-   Make sure you're up-to-date with the [superproject](https://github.com/liferay/liferay-ckeditor) repository:

    ```sh
    git pull origin master
    ```

-   Set up everything to start working on a patch:

    ```sh
    ./ck.sh setup
    ```

-   Work on your changes:

    `cd` into the `ckeditor-dev/` submodule and prepare your desired changes on the `liferay` branch.

    This could be `cherry-pick`ing a previously created commit or manually editing a file, so this can't be automated.

-   Create your commit, add your changes and write a good commit message.

-   Navigate back to the superproject's root directory and update the contents of the "patches/" directory:

    ```sh
    cd ..
    ./ck.sh patch
    ```

-   Create a build of CKEditor containing the patches:

    From the root of the superproject's directory, run

    ```sh
    ./ck.sh build
    ```

    If you'd rather like a development build, for example for local debugging, use:

    ```sh
    DEBUG=1 ./ck.sh build
    ```

    **WARNING**: You should never publish development builds to the npm registry.

-   For non-development builds, the updated build artifacts will be committed automatically. Be aware that if you ever wish to stage and commit build artifacts by hand, you should do so using:

    ```sh
    git add ckeditor
    ```

    because variants such as `git add .`, `git add -A`, `git add -f`, `git add -u` etc can cause you to unintentionally modify the target of the `ckeditor-dev` submodule.

### Updating the base version of CKEditor

To update the upstream CKEditor code to a new version, run:

```sh
./ck.sh update
```

A prompt will appear asking you which version you'd like to select. This will update the ckeditor-dev submodule to point at the corresponding commit.

**NOTE:** In order to prevent unintended commits to the submodule, using `ck.sh update` is the only supported way to change the commit the submodule is referencing. Git is configured to ignore changes to the submodule, so you will only see them in the output of commands like `git status`, `git show`, `git log -p` (etc) if you pass the `--ignore-submodules=none` switch.

#### Resolving problems while updating CKEditor's base version

> `./ck.sh update` should only be used to check that everything is in order before applying changes, and we cannot expect it to be used to resolve conflicts.

You may encounter some issues throughout the upgrade process. You can take the following actions to properly resolve these conflicts:

1. Navigate to the `ckeditor-dev/` subdirectory and manually resolve conflicts by rebasing with the proper tag/version you want to upgrade. `git pull —rebase 4.18.0`, for example, can be used to rebase with 4.18.0.
2. Go to `liferay-ckeditor/` and run `./ck.sh update` after the submodule has been successfully updated. Choose the correct version of ckeditor you're trying to update, then check to see if everything under `ckeditor-dev` is fine and without conflicts.
3. If everything looks good and there are no conflicts, run `./ck.sh patch` to update the `patches/` folder, and don't forget to leave a good commit message. `chore: update patches for upgrading to CKEditor 4.18.0` is an example of a decent commit message for this type of change.

### Testing in [liferay-portal](https://github.com/liferay/liferay-portal)

To test your local CKEditor build in liferay-portal:

0. Make sure you have your liferay-portal instance configured to use CKEditor in at least one place by setting one of [the appropriate properties](https://github.com/liferay/liferay-portal/blob/c9a9b9f196b1f1dd5cf83cddf6bf1f1f8c9ff814/portal-impl/src/portal.properties#L5490-L5499) in your `portal-ext.properties` file.

    - For example, you could set `editor.wysiwyg.portal-web.docroot.html.portlet.blogs.edit_entry.jsp=ckeditor` to test CKEditor in the [Site] → "Content & Data" → "Blogs" interface.
    - Ideally, you should also test that [AlloyEditor](AlloyEditor) still works too &mdash; for example, at [Site] → "Content & Data" → "Web Content" &mdash; because we have that [configured to use the shared CKEditor build rather than its own bundled copy](https://github.com/liferay/liferay-portal/blob/c9a9b9f196b1f1dd5cf83cddf6bf1f1f8c9ff814/modules/apps/frontend-editor/frontend-editor-alloyeditor-web/src/main/resources/META-INF/resources/resources.jsp#L37-L39).

1. Navigate to the [frontend-editor-ckeditor-web](https://github.com/liferay/liferay-portal/tree/master/modules/apps/frontend-editor/frontend-editor-ckeditor-web) module
1. Run `yarn add $PATH_TO_LOCAL_LIFERAY_CKEDITOR_REPO` (in Liferay DXP and Portal CE 7.1 and above), or `npm install $PATH_TO_LOCAL_LIFERAY_CKEDITOR_REPO` (in Liferay DXP and Portal CE version 7.0).
1. Re-deploy the module with `gradlew clean deploy`.

**Note:** If you have problems with deploying after `yarn add` it may be that Gradle is confused by the reference to a local package. In this case, you may be able hackily workaround the problem, temporarily, by updating the `node_modules` directory manually instead:

```sh
rm -r modules/node_modules/liferay-ckeditor
cp -R $PATH_TO_LOCAL_LIFERAY_CKEDITOR_REPO modules/node_modules/
```

And resetting the changes in the `package.json` and `yarn.lock` files on the `frontend-editor-ckeditor-web` module caused by running `yarn add`.

### Publishing the liferay-ckeditor package to NPM

1.  Update, build and commit the result.

    ```sh
    # Confirm that worktree is clean and up-to-date.
    git checkout master
    git pull upstream master --ff-only
    git status

    # Build and commit.
    ./ck.sh build
    ```

    **NOTE:** Check that only files in `ckeditor` folder are being committed.

2.  After successfully building and testing, you can publish to NPM, and update Git.

    ```sh
    # See all checks pass locally:
    yarn ci

    # See "Choosing a version number" below for guidance about the version number:
    VERSION=4.13.1-liferay.2

    # Update the CHANGELOG:
    npx liferay-changelog-generator --version=$VERSION

    # Inspect and add changes:
    git add -p CHANGELOG.md

    # Confirm you are logged in on Github and NPM
    ssh -T git@github.com
    yarn login

    # Publish
    yarn version --new-version $VERSION
    ```

    Running `yarn version` has the following effects:

    -   The "preversion" script will run, which effectively runs `yarn ci` again.
    -   The "package.json" gets updated with the new version number.
    -   The "version" script will run, which checks that the proposed version number matches the expected format and corresponds to the version in the CKEditor submodule and build artifacts.
    -   A tagged commit is created, including the changes to the CHANGELOG that you staged in a prior step.
    -   The "postversion" script will run, which automatically does `git push` and performs a `yarn publish`, prompting for confirmation along the way.

3.  Paste the relevant section from the CHANGELOG.md to [the corresponding release page](https://github.com/liferay/liferay-ckeditor/releases).

4.  **NOTE:** One effect of using version numbers that include a `-liferay` suffix is that `liferay-js-publish` will interpret them as prerelease versions, in compliance with [how NPM defines prerelease ranges](https://docs.npmjs.com/misc/semver#prerelease-tags) (in agreement with [the SemVer spec](https://semver.org/#spec-item-9)). This means that they will get a `prelease` tag in the NPM registry instead of the default `latest` tag. If you wish to, you can remove this unwanted `prelease` tag and point the `latest` tag at the version you just released with:

    ```sh
    npm dist-tag rm liferay-ckeditor prerelease
    npm dist-tag add liferay-ckeditor@$VERSION latest
    ```

    But in practice, this is optional because we always use an exact version specifier when referencing liferay-ckeditor from [liferay-portal](https://github.com/liferay/liferay-portal) ([example](https://github.com/brianchandotcom/liferay-portal/pull/87677/files)).

5.  After the release, you can confirm that the packages are correctly listed in the NPM registry:

    -   https://www.npmjs.com/package/liferay-ckeditor

#### Choosing a version number

For tagging and publishing `$VERSION` should be of the form `$CKEDITOR_VERSION-liferay.$RELEASE`. For example, "4.11.3-liferay.1"; that is:

-   Based on CKEditor 4.11.3.
-   Release number 1.

Subsequent releases would be "4.11.3-liferay.2", "4.11.3-liferay.3" and so on. When we update to CKEditor 4.11.4, we reset the suffix, so the release would be "4.11.4-liferay.1", "4.11.4-liferay.2" and so on.

**WARNING**: You should never publish development builds to the npm registry.

### Updating CKEditor in [liferay-portal](https://github.com/liferay/liferay-portal)

To update CKEditor in liferay-portal:

1. Navigate to the [frontend-editor-ckeditor-web](https://github.com/liferay/liferay-portal/tree/master/modules/apps/frontend-editor/frontend-editor-ckeditor-web) module
2. Update the `liferay-ckeditor` dependency in using `yarn add liferay-ckeditor@$VERSION`.
3. Re-deploy the module with `gradlew clean deploy`.

An example of this can be seen in [this PR](https://github.com/brianchandotcom/liferay-portal/pull/87677).

### Creating and building a custom skin

1. Create a new skin running `./ck.sh createskin`.
2. Edit the skin at `/skins/yourskin` folder.
3. Build the skin running `./ck.sh build`.
