import React from 'react';
import './LinearProgressBar.css';

export default function LinearProgressBar(prop) {
  const { progress } = prop;

  return (
    <>
      <div styleName="outerBar">
        <div
          style={{
            height: '6px',
            backgroundColor: '#00AB84',
            width: `${progress}%`,
            maxWidth: '99%',
            borderRadius: '1px',
          }}
        />
      </div>
    </>

  );
}
