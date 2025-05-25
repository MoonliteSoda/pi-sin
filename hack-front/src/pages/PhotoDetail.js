import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PhotoProvider, PhotoView } from 'react-photo-view';
// import 'react-photo-view/build/react-photo-view.css'; // Стили для галереи [[3]]
import ImageEditor from '../components/ImageEditor';

// Основной компонент страницы
const PhotoDetail = () => {
  const { projectId, photoId } = useParams();
  const [imageData, setImageData] = useState(null);
  const [yoloData, setYoloData] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/projects/${projectId}/files/${photoId}`);
        if (!response.ok) throw new Error('Ошибка загрузки данных');
        const data = await response.json();
        setImageData(data);
        
        // Если есть разметка YOLO, загружаем её
        if (data.s3_txt_url) {
          const yoloResponse = await fetch(data.s3_txt_url);
          const yoloText = await yoloResponse.text();
          setYoloData(yoloText);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, photoId]);

  const handleDelete = () => {
    // Implement delete functionality
    if (window.confirm('Are you sure you want to delete this file?')) {
      // Add delete API call here
      console.log('Deleting file:', photoId);
    }
  };

  const handleVerify = () => {
    // Implement verification functionality
    console.log('Verifying file:', photoId);
  };

  const handleSave = () => {
    // Implement save functionality
    console.log('Saving changes for file:', photoId);
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div style={{ height: 'calc(100vh - 64px)', width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* File info and action panel */}
      <div style={{ 
        padding: '10px 16px', 
        backgroundColor: 'var(--primary-color)', 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontWeight: 'medium' }}>
          {imageData?.filename || 'Untitled Image'}
        </div>
        <div>
          <button 
            onClick={handleDelete}
            style={{ 
              marginRight: '8px', 
              padding: '6px 12px', 
              backgroundColor: '#f44336', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Удалить
          </button>
          <button 
            onClick={handleVerify}
            style={{ 
              marginRight: '8px', 
              padding: '6px 12px', 
              backgroundColor: '#2196f3', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Разметить
          </button>
          <button 
            onClick={handleSave}
            style={{ 
              padding: '6px 12px', 
              backgroundColor: '#4caf50', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Сохранить разметку
          </button>
        </div>
      </div>

      {/* Image Editor */}
      <div style={{ flex: 1 }}>
        {imageData && (
          <ImageEditor imageUrl={imageData.s3_url || 'http://94.154.128.76:9000/user-data/1/8e57a487-8495-4ad5-b663-7ce88a3c19b3.jpg'} />
        )}
        {!imageData && (
          <ImageEditor />
        )}
      </div>
    </div>
  );
};

export default PhotoDetail;
