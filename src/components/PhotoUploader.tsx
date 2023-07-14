// src/components/PhotoUploader.tsx
import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

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

interface UploadPhotoData {
  uploadPhoto: {
    ok: boolean;
    message?: string;
    photo: {
      id: string;
      caption: string;
      hashtags: {
        name: string;
      }[];
    };
  };
}

const PhotoUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [uploadPhoto] = useMutation<UploadPhotoData>(UPLOAD_PHOTO);
  
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      console.error('파일이 선택되지 않았습니다');
      return;
    }

    try {
      const { data } = await uploadPhoto({
        variables: {
          file,
          caption,
        },
      });

      if (data) {
        console.log('UploadPhoto 응답:', data.uploadPhoto);
      }
    } catch (error) {
      console.error('사진 업로드 중 오류:', error);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
          } else {
            setFile(null);
          }
        }}
      />
      <input
        type="text"
        placeholder="Caption"
        value={caption}
        onChange={e => setCaption(e.target.value)}
      />
      <button type="submit" disabled={!file}>사진 업로드</button>
    </form>
  );
};

export default PhotoUploader;
