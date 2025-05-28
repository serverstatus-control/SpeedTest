import { useState } from 'react';
import { faDownload, faUpload, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import SpeedIndicator from './SpeedIndicator';

// Inizializza FontAwesome
library.add(faDownload, faUpload, faTachometerAlt);
import './SpeedTest.css';

const SpeedTest = () => {
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [ping, setPing] = useState(0);
  const [isTesting, setIsTesting] = useState(false);

  const testSpeed = async () => {
    setIsTesting(true);
    
    // Test ping
    await testPing();
    
    // Test download
    await testDownload();
    
    // Test upload
    await testUpload();
    
    setIsTesting(false);
  };

  const testPing = async () => {
    try {
      const startTime = performance.now();
      await fetch('https://www.google.com/generate_204');
      const endTime = performance.now();
      const pingTime = Math.round(endTime - startTime);
      setPing(pingTime);
    } catch (error) {
      console.error('Error testing ping:', error);
      setPing(0);
    }
  };

  const testDownload = async () => {
    try {
      const fileSize = 5 * 1024 * 1024; // 5MB
      const testFile = `https://cors-anywhere.herokuapp.com/http://speedtest.ftp.otenet.gr/files/test${fileSize}.db`;
      
      const startTime = performance.now();
      const response = await fetch(testFile);
      await response.blob();
      const endTime = performance.now();
      
      const durationInSeconds = (endTime - startTime) / 1000;
      const bitsLoaded = fileSize * 8;
      const speedBps = (bitsLoaded / durationInSeconds);
      const speedMbps = Math.round(speedBps / (1024 * 1024));
      
      setDownloadSpeed(speedMbps);
    } catch (error) {
      console.error('Error testing download:', error);
      setDownloadSpeed(0);
    }
  };

  const testUpload = async () => {
    try {
      const blob = new Blob([new ArrayBuffer(1 * 1024 * 1024)]); // 1MB
      const startTime = performance.now();
      await fetch('https://cors-anywhere.herokuapp.com/http://speedtest.ftp.otenet.gr/upload.php', {
        method: 'POST',
        body: blob
      });
      const endTime = performance.now();
      
      const durationInSeconds = (endTime - startTime) / 1000;
      const bitsLoaded = blob.size * 8;
      const speedBps = (bitsLoaded / durationInSeconds);
      const speedMbps = Math.round(speedBps / (1024 * 1024));
      
      setUploadSpeed(speedMbps);
    } catch (error) {
      console.error('Error testing upload:', error);
      setUploadSpeed(0);
    }
  };

  return (
    <div className="speed-test-container">
      <div className="speed-indicators">
        <SpeedIndicator
          icon={faDownload}
          value={downloadSpeed}
          unit="Mbps"
          label="Download"
          isTesting={isTesting}
          maxValue={100}
        />
        <SpeedIndicator
          icon={faUpload}
          value={uploadSpeed}
          unit="Mbps"
          label="Upload"
          isTesting={isTesting}
          maxValue={100}
        />
        <SpeedIndicator
          icon={faTachometerAlt}
          value={ping}
          unit="ms"
          label="Ping"
          isTesting={isTesting}
          maxValue={200}
        />
      </div>
      <button
        className="start-button"
        onClick={testSpeed}
        disabled={isTesting}
      >
        {isTesting ? 'Test in corso...' : 'Avvia Test'}
        <span className="button-effect"></span>
      </button>
    </div>
  );
};

export default SpeedTest;
