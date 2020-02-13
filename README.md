# liferay-ckeditor

This repo contains tooling for maintaining Liferay's customized version of CKEditor.

## Structure

- A submodule at `ckeditor-dev` pointing at [the upstream CKEditor project](https://github.com/ckeditor/ckeditor4).
- [A `patches/` directory](https://github.com/liferay/liferay-ckeditor/tree/master/patches) containing Liferay-specific changes to be applied to the upstream.
- [A `ck.sh` script](https://github.com/liferay/liferay-ckeditor/blob/master/ck.sh) for setting up the project, creating/updating patches, and producing releases.
- [A `ckeditor` directory](https://github.com/liferay/liferay-ckeditor/tree/master/ckeditor) containing the committed build artifacts.

For details on why we settled on this approach, please see issues [#7](https://github.com/liferay/liferay-ckeditor/issues/7) and [#16](https://github.com/liferay/liferay-ckeditor/issues/16), but in short, the desired attributes are:

- Make Liferay-specific patches easy to inspect by [aggregating them into a directory](https://github.com/liferay/liferay-ckeditor/tree/master/patches).
- Make changes in patches over time obvious (by inspecting [their history](https://github.com/liferay/liferay-ckeditor/commits/master/patches)).
- Make changes in build artifacts obvious (again, but inspecting [their history](https://github.com/liferay/liferay-ckeditor/commits/master/ckeditor)).

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

      git pull origin master

- Set up everything to start working on a patch:

      sh ck.sh setup

- Work on your changes:

  `cd` into the `ckeditor-dev/` submodule and prepare your desired changes on the `liferay` branch.

  This could be `cherry-pick`ing a previously created commit or manually editing a file, so this can't be automated.

- Create your commit, add your changes and write a good commit message.

- Navigate back to the superproject's root directory and update the contents of the "patches/" directory:

      cd ..
      sh ck.sh patch

- Create a build of CKEditor containing the patches:

  From the root of the superproject's directory, run

      sh ck.sh build

  If you'd rather like a development build, for example for local debugging, use:

      DEBUG=1 ./ck.sh build

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

### Publishing the liferay-ckeditor package to NPM

After successfully building and testing you can publish to NPM.

```sh
# Confirm that worktree is clean and up-to-date.
git checkout master
git pull upstream master --ff-only
git status

# See all checks pass locally:
yarn ci

# See "Choosing a version number" below for guidance about the version number:
VERSION=4.13.1-liferay.2

# Update the CHANGELOG:
npx liferay-changelog-generator --version=$VERSION

# Inspect and add changes:
git add -p CHANGELOG.md

yarn version --new-version $VERSION
```

Running `yarn version` has the following effects:

- The "preversion" script will run, which effectively runs `yarn ci` again.
- The "package.json" gets updated with the new version number.
- The "version" script will run, which checks that the proposed version number matches the expected format and corresponds to the version in the CKEditor submodule and build artifacts.
- A tagged commit is created, including the changes to the CHANGELOG that you staged in a prior step.
- The "postversion" script will run, which automatically does `git push` and performs a `yarn publish`, prompting for confirmation along the way.

After the release, you can confirm that the packages are correctly listed in the NPM registry:

- https://www.npmjs.com/package/liferay-ckeditor

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
