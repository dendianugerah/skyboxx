# Skyboxx

Skyboxx is a flexible file upload drag and drop component for multiple cloud providers. It provides an easy-to-use interface for file uploads to various cloud storage services, making it simple to integrate cloud storage functionality into your React applications.

[![npm version](https://badge.fury.io/js/skyboxx.svg)](https://badge.fury.io/js/skyboxx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- Drag and drop file upload interface
- Support for multiple cloud providers (currently Supabase and AWS S3)
- Customizable appearance with Tailwind CSS classes
- Real-time progress tracking for uploads
- Configurable file type and size restrictions
- Multiple file upload support
- Error handling and success feedback

## Installation

You can install Skyboxx using npm, yarn, or pnpm:

```bash
npm install skyboxx
# or
yarn add skyboxx
# or
pnpm add skyboxx
```

## Quick Start

Here's a basic example of how to use the Skyboxx component:

```jsx
import React from 'react';
import { SkyboxUpload, Config } from 'skyboxx';

const App = () => {
  const config: Config = {
    supabase: {
      url: 'YOUR_SUPABASE_URL',
      key: 'YOUR_SUPABASE_KEY',
      bucketName: 'YOUR_BUCKET_NAME',
      path: 'uploads'
    }
  };

  const handleUploadComplete = (urls) => {
    console.log('Uploaded files:', urls);
  };

  return (
    <div>
      <h1>File Upload Example</h1>
      <SkyboxUpload
        cloudProvider="supabase"
        cloudConfig={config}
        onUploadComplete={handleUploadComplete}
        maxSize={5 * 1024 * 1024} // 5MB
        multiple={true}
        acceptedFileTypes={{
          'image/*': ['.jpeg', '.png', '.gif']
        }}
        className="p-4 border-2 border-dashed border-gray-300"
      />
    </div>
  );
};

export default App;
```

## Cloud Provider Configuration

Skyboxx currently supports Supabase and AWS S3. Here's how to configure each provider:

### Supabase

```typescript
const config: Config = {
  supabase: {
    url: 'YOUR_SUPABASE_URL',
    key: 'YOUR_SUPABASE_KEY',
    bucketName: 'YOUR_BUCKET_NAME',
    path: 'uploads'
  }
};
```

### AWS S3

```typescript
const config: Config = {
  aws: {
    region: 'YOUR_AWS_REGION',
    accessKeyId: 'YOUR_ACCESS_KEY_ID',
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
    bucketName: 'YOUR_BUCKET_NAME',
    path: 'uploads'
  }
};
```

## Component Props

The `SkyboxUpload` component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cloudProvider` | `'supabase' \| 'aws'` | - | The cloud storage provider to use |
| `cloudConfig` | `Config` | - | Configuration object for the chosen cloud provider |
| `onUploadComplete` | `(urls: string[]) => void` | - | Callback function called when uploads are complete |
| `maxSize` | `number` | `10 * 1024 * 1024` | Maximum file size in bytes (default: 10MB) |
| `multiple` | `boolean` | `false` | Allow multiple file uploads |
| `acceptedFileTypes` | `Accept` | - | Object specifying accepted file types |
| `className` | `string` | - | Additional CSS classes for styling |

## Styling

Skyboxx uses Tailwind CSS classes for styling. You can customize the appearance by passing additional classes through the `className` prop:

```jsx
<SkyboxUpload
  className="p-4 border-2 border-dashed border-blue-500 rounded-lg"
  // ... other props
/>
```

## Error Handling

Skyboxx provides built-in error handling for common issues such as file size limits and file type restrictions. These errors are displayed to the user within the component.

## Supported Cloud Providers

Currently, Skyboxx supports the following cloud providers:

- Supabase
- AWS S3

We're actively working on adding support for more providers, including Google Cloud Storage, Azure Blob Storage, and others. Stay tuned for updates!

## Contributing

We welcome contributions to Skyboxx! Please feel free to submit a Pull Request.

## License

Skyboxx is [MIT licensed](LICENSE).

## Support

If you encounter any problems or have any questions, please open an issue in this repository. We're here to help!

## Acknowledgements

Skyboxx is built with the following amazing open-source projects:

- [React](https://reactjs.org/)
- [react-dropzone](https://react-dropzone.js.org/)
- [@aws-sdk/client-s3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)
- [@supabase/supabase-js](https://supabase.com/docs/reference/javascript/introduction)
- [Tailwind CSS](https://tailwindcss.com/)

## Roadmap

- [ ] Add support for Google Cloud Storage
- [ ] Implement file type validation using file signatures
- [ ] Add customizable UI themes
- [ ] Implement client-side image compression option
- [ ] Add support for resumable uploads for large files

We're constantly working to improve Skyboxx and add new features. If you have any suggestions or feature requests, please open an issue or contribute!