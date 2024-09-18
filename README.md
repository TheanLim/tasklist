You can find the website at https://theanlim.github.io/tasklist/

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Deploying to Github Pages
### Activate GitHub Pages for Your Repository
Navigate to the Settings tab, select Pages from the left-hand menu, and locate the dropdown for the deployment Source. Change the Source to GitHub Actions.

### Configure the Next.js Build Process
To deploy a Next.js app on GitHub Pages, you need to change the build output to generate static files, as GitHub Pages only supports static hosting (HTML, CSS, JavaScript). By default, Next.js uses Node.js, which is incompatible with GitHub Pages. To resolve this, modify next.config.js by setting the output option to "export":

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",  // <=== enables static exports
  reactStrictMode: true,
};

module.exports = nextConfig;
```

After running next build, Next.js will generate an out folder containing static assets, which you can then upload to GitHub Pages.  
Undo this change for local development.

### Configure Base Path
By default, Next.js maps all static assets the domain (e.x., https://theanlim.github.io/). But Github assigned a dedicated subdomain for this repository Github Pages (e.x., https://theanlim.github.io/tasklist/). This leads to a mismatch of the base path.  
To fix this, we can set up a path prefix by adding basePath inside the next.config.js file:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/tasklist",  // <=== configure base path
  output: "export",
  reactStrictMode: true,
};

module.exports = nextConfig;
```
Undo this change for local development.

### Configure Github Actions
Add a [Github Workflow yml](.github/workflows/nextjs.yml) to publish the application to Github Pages.

### 404.html
Add a [404.html](/public/404.html) - This is needed when deploying Next.js to GitHub Pages because GitHub Pages is designed to host static files, while Next.js uses Node.js to run the application. 
Undo this change for local development.

