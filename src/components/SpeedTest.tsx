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
      const numberOfTests = 5;
      let totalPing = 0;
      for (let i = 0; i < numberOfTests; i++) {
        const startTime = performance.now();
        // Usa un endpoint che risponde velocemente e supporta CORS
        await fetch('https://cors-test.appspot.com/test', { cache: 'no-store' });
        const endTime = performance.now();
        const pingTime = endTime - startTime;
        totalPing += pingTime;
        if (i < numberOfTests - 1) {
          await new Promise(resolve => setTimeout(resolve, 150));
        }
      }
      const averagePing = Math.round(totalPing / numberOfTests);
      setPing(Math.max(1, averagePing));
    } catch (error) {
      console.error('Error testing ping:', error);
      setPing(1);
    }
  };

  const testDownload = async () => {
    try {
      const testUrls = [
        'https://speed.cloudflare.com/__down', // endpoint Cloudflare che supporta CORS
        'https://speed.hetzner.de/1MB.bin',
        'https://proof.ovh.net/files/10Mio.dat'
      ];
      let success = false;
      for (const testUrl of testUrls) {
        try {
          const startTime = performance.now();
          const response = await fetch(testUrl, { cache: 'no-store' });
          if (!response.ok) continue;
          const reader = response.body?.getReader();
          if (!reader) continue;
          let lastTime = startTime;
          let speeds: number[] = [];
          // chunkCount rimosso perché non usato
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const now = performance.now();
            const duration = (now - lastTime) / 1000;
            if (duration > 0.2 && value.length > 0) {
              const speedMbps = (value.length * 8) / (duration * 1024 * 1024);
              if (speedMbps > 0) speeds.push(speedMbps);
              const recentSpeeds = speeds.slice(-5);
              setDownloadSpeed(Math.round(recentSpeeds.reduce((a, b) => a + b, 0) / recentSpeeds.length));
              lastTime = now;
            }
          }
          if (speeds.length > 0) {
            if (speeds.length >= 5) {
              speeds.sort((a, b) => a - b);
              speeds = speeds.slice(1, -1);
            }
            const avgSpeed = Math.round(speeds.reduce((a, b) => a + b, 0) / speeds.length);
            setDownloadSpeed(avgSpeed);
            success = true;
            break;
          }
        } catch {
          continue;
        }
      }
      if (!success) {
        setDownloadSpeed(-1); // -1 indica errore
      }
    } catch {
      setDownloadSpeed(-1);
    }
  };

  const testUpload = async () => {
    try {
      const testUrls = [
        'https://httpbin.org/post',
        'https://postman-echo.com/post',
        'https://proof.ovh.net/upload.php'
      ];
      let success = false;
      const chunkSize = 512 * 1024;
      const chunks = 4;
      let speeds: number[] = [];
      for (const testUrl of testUrls) {
        try {
          for (let i = 0; i < chunks; i++) {
            const chunk = new Uint8Array(chunkSize);
            crypto.getRandomValues(chunk);
            const blob = new Blob([chunk]);
            const startTime = performance.now();
            const response = await fetch(testUrl, {
              method: 'POST',
              body: blob,
              headers: { 'Content-Type': 'application/octet-stream' }
            });
            if (!response.ok) continue;
            const endTime = performance.now();
            const duration = (endTime - startTime) / 1000;
            if (duration > 0) {
              const speedMbps = (blob.size * 8) / (duration * 1024 * 1024);
              if (speedMbps > 0) speeds.push(speedMbps);
              setUploadSpeed(Math.round(speeds.reduce((a, b) => a + b, 0) / speeds.length));
            }
          }
          if (speeds.length > 0) {
            if (speeds.length >= 4) {
              speeds.sort((a, b) => a - b);
              speeds = speeds.slice(1, -1);
            }
            setUploadSpeed(Math.round(speeds.reduce((a, b) => a + b, 0) / speeds.length));
            success = true;
            break;
          }
        } catch {
          continue;
        }
      }
      if (!success) {
        setUploadSpeed(-1);
      }
    } catch {
      setUploadSpeed(-1);
    }
  };

  return (
    <div className="speed-test-container">
      <div className="speed-indicators">
        <SpeedIndicator
          icon={faDownload}
          value={downloadSpeed === -1 ? 0 : downloadSpeed}
          unit="Mbps"
          label={downloadSpeed === -1 ? "Errore" : "Download"}
          isTesting={isTesting}
          maxValue={100}
        />
        <SpeedIndicator
          icon={faUpload}
          value={uploadSpeed === -1 ? 0 : uploadSpeed}
          unit="Mbps"
          label={uploadSpeed === -1 ? "Errore" : "Upload"}
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
