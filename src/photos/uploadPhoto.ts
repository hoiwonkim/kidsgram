// ./src/photos/uploadPhoto.ts
import { createUploadLink } from 'apollo-upload-client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { gql, useMutation } from '@apollo/client/react';

interface NameField {
  name: string;
}

interface HashtagsField {
  hashtags: NameField[];
}

interface Photo {
  id: string;
  caption: string;
  hashtags: HashtagsField[];
}

interface UploadPhotoResponse {
  ok: boolean;
  message?: string;
  photo: Photo;
}

// 1. Create a new Apollo client with file upload support
const client = new ApolloClient({
  link: createUploadLink({
    uri: 'http://localhost:4000'
  }),
  cache: new InMemoryCache()
});

// 2. Define the UploadPhoto mutation
const UPLOAD_PHOTO = gql`
  mutation UploadPhoto($file: Upload!, $caption: String) {
    uploadPhoto(input: { file: $file, caption: $caption }) {
      ok
      message
      photo {
        id
        caption
        hashtags {
          name
        }
      }
    }
  }
`;

// 3. Use mutation hook
const [uploadPhoto] = useMutation<UploadPhotoResponse>(UPLOAD_PHOTO);

// 4. Create the function to handle file uploads
const handleFileUpload = async (file: File, caption: string) => {
  try {
    // Execute the mutation and pass the file and caption as variables
    const { data } = await uploadPhoto({
      variables: {
        file,
        caption
      }
    });

    // Handle the mutation response
    if (data) {
      console.log('UploadPhoto response:', data.uploadPhoto);
    }
  } catch (error) {
    console.error('Error uploading photo:', error);
  }
};

// 5. Use handleFileUpload with a file and a caption
const file: File = /* Retrieve the file from an input field or other source */;
const caption = 'My awesome photo caption';
handleFileUpload(file, caption);
