import React from 'react';
import './ErrorBox.css';

interface ErrorBoxProps {
  message: string;
}

export function ErrorBox({ message }: ErrorBoxProps) {
  if (!message) return null;
  return <div className="error-box">{message}</div>;
}
