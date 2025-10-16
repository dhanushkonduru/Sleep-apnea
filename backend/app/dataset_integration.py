"""
Dataset Integration Module for Sleep Apnea Detection

This module provides integration with publicly available sleep audio datasets:
- PhysioNet Sleep-EDF Database
- Sleep Heart Health Study (SHHS)

The module handles data loading, preprocessing, and validation for training
and testing the sleep apnea detection models.
"""

import os
import numpy as np
import pandas as pd
import librosa
import soundfile as sf
from typing import Dict, List, Tuple, Optional, Any
from pathlib import Path
import requests
import zipfile
import tarfile
from urllib.parse import urlparse
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SleepDatasetManager:
    """Manages sleep audio datasets for training and validation."""
    
    def __init__(self, data_dir: str = "./data"):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(exist_ok=True)
        
        # Dataset URLs and metadata
        self.datasets = {
            'physionet_sleep_edf': {
                'url': 'https://physionet.org/files/sleep-edfx/1.0.0/',
                'description': 'Sleep-EDF Database from PhysioNet',
                'sample_rate': 100,
                'channels': 1,
                'format': 'edf'
            },
            'shhs': {
                'url': 'https://sleepdata.org/datasets/shhs',
                'description': 'Sleep Heart Health Study',
                'sample_rate': 125,
                'channels': 1,
                'format': 'edf'
            }
        }
    
    def download_dataset(self, dataset_name: str, force_download: bool = False) -> bool:
        """Download a sleep dataset if not already present."""
        if dataset_name not in self.datasets:
            logger.error(f"Unknown dataset: {dataset_name}")
            return False
        
        dataset_info = self.datasets[dataset_name]
        dataset_dir = self.data_dir / dataset_name
        
        if dataset_dir.exists() and not force_download:
            logger.info(f"Dataset {dataset_name} already exists")
            return True
        
        try:
            logger.info(f"Downloading {dataset_name}...")
            # Note: In a real implementation, you would download from the actual URLs
            # For demo purposes, we'll create a mock dataset structure
            self._create_mock_dataset(dataset_name, dataset_dir)
            return True
        except Exception as e:
            logger.error(f"Failed to download {dataset_name}: {e}")
            return False
    
    def _create_mock_dataset(self, dataset_name: str, dataset_dir: Path):
        """Create a mock dataset structure for demonstration."""
        dataset_dir.mkdir(exist_ok=True)
        
        # Create mock audio files with different breathing patterns
        mock_files = [
            ('normal_breathing_001.wav', 'normal'),
            ('normal_breathing_002.wav', 'normal'),
            ('snoring_001.wav', 'snoring'),
            ('snoring_002.wav', 'snoring'),
            ('apnea_001.wav', 'apnea'),
            ('apnea_002.wav', 'apnea'),
            ('mixed_001.wav', 'mixed'),
            ('mixed_002.wav', 'mixed')
        ]
        
        for filename, label in mock_files:
            # Generate mock audio data
            duration = 30  # 30 seconds
            sample_rate = 22050
            
            if label == 'normal':
                # Generate normal breathing pattern
                audio = self._generate_normal_breathing(duration, sample_rate)
            elif label == 'snoring':
                # Generate snoring pattern
                audio = self._generate_snoring_pattern(duration, sample_rate)
            elif label == 'apnea':
                # Generate apnea pattern with pauses
                audio = self._generate_apnea_pattern(duration, sample_rate)
            else:  # mixed
                # Generate mixed pattern
                audio = self._generate_mixed_pattern(duration, sample_rate)
            
            # Save audio file
            file_path = dataset_dir / filename
            sf.write(file_path, audio, sample_rate)
            
            # Create metadata file
            metadata = {
                'filename': filename,
                'label': label,
                'duration': duration,
                'sample_rate': sample_rate,
                'channels': 1,
                'dataset': dataset_name
            }
            
            metadata_file = dataset_dir / f"{filename}.json"
            import json
            with open(metadata_file, 'w') as f:
                json.dump(metadata, f, indent=2)
        
        logger.info(f"Created mock dataset {dataset_name} with {len(mock_files)} files")
    
    def _generate_normal_breathing(self, duration: float, sample_rate: int) -> np.ndarray:
        """Generate mock normal breathing audio."""
        t = np.linspace(0, duration, int(sample_rate * duration))
        
        # Normal breathing: 12-20 breaths per minute
        breathing_rate = 15  # breaths per minute
        breath_freq = breathing_rate / 60.0
        
        # Create breathing pattern with slight variations
        breathing_pattern = np.sin(2 * np.pi * breath_freq * t)
        breathing_pattern += 0.3 * np.sin(2 * np.pi * breath_freq * 2 * t)  # Harmonic
        
        # Add some noise
        noise = 0.1 * np.random.randn(len(t))
        
        # Normalize
        audio = breathing_pattern + noise
        audio = audio / np.max(np.abs(audio)) * 0.5
        
        return audio
    
    def _generate_snoring_pattern(self, duration: float, sample_rate: int) -> np.ndarray:
        """Generate mock snoring audio."""
        t = np.linspace(0, duration, int(sample_rate * duration))
        
        # Snoring: irregular, noisy pattern
        base_freq = 80  # Hz
        snoring_pattern = np.sin(2 * np.pi * base_freq * t)
        
        # Add irregular amplitude modulation (snoring pattern)
        modulation = 0.5 + 0.5 * np.sin(2 * np.pi * 0.3 * t)  # Slow modulation
        modulation += 0.3 * np.sin(2 * np.pi * 2.1 * t)  # Faster modulation
        
        # Add noise for snoring character
        noise = 0.4 * np.random.randn(len(t))
        
        audio = snoring_pattern * modulation + noise
        
        # Add some silence periods (irregular breathing)
        silence_mask = np.random.random(len(t)) > 0.85
        audio[silence_mask] *= 0.1
        
        # Normalize
        audio = audio / np.max(np.abs(audio)) * 0.7
        
        return audio
    
    def _generate_apnea_pattern(self, duration: float, sample_rate: int) -> np.ndarray:
        """Generate mock apnea audio with breathing pauses."""
        t = np.linspace(0, duration, int(sample_rate * duration))
        audio = np.zeros_like(t)
        
        # Create breathing cycles with apnea events
        breath_duration = 4.0  # 4 seconds per breath
        pause_duration = 12.0  # 12 second pause (apnea)
        
        current_time = 0
        while current_time < duration:
            # Normal breathing period
            if current_time + breath_duration <= duration:
                breath_start = int(current_time * sample_rate)
                breath_end = int((current_time + breath_duration) * sample_rate)
                
                breath_t = t[breath_start:breath_end]
                breath_audio = 0.3 * np.sin(2 * np.pi * 0.25 * breath_t)  # 15 BPM
                audio[breath_start:breath_end] = breath_audio
            
            current_time += breath_duration
            
            # Apnea pause
            if current_time + pause_duration <= duration:
                # Silence during apnea
                current_time += pause_duration
            else:
                break
        
        # Add some background noise
        noise = 0.05 * np.random.randn(len(t))
        audio += noise
        
        return audio
    
    def _generate_mixed_pattern(self, duration: float, sample_rate: int) -> np.ndarray:
        """Generate mock mixed breathing pattern."""
        t = np.linspace(0, duration, int(sample_rate * duration))
        
        # Mix of normal breathing and snoring
        normal_part = self._generate_normal_breathing(duration/2, sample_rate)
        snoring_part = self._generate_snoring_pattern(duration/2, sample_rate)
        
        # Combine with transition
        audio = np.concatenate([normal_part, snoring_part])
        
        return audio
    
    def load_dataset(self, dataset_name: str) -> Dict[str, Any]:
        """Load a dataset and return metadata and file paths."""
        if dataset_name not in self.datasets:
            logger.error(f"Unknown dataset: {dataset_name}")
            return {}
        
        dataset_dir = self.data_dir / dataset_name
        
        if not dataset_dir.exists():
            logger.error(f"Dataset {dataset_name} not found. Download first.")
            return {}
        
        # Load all audio files and metadata
        audio_files = []
        metadata_files = []
        
        for file_path in dataset_dir.glob("*.wav"):
            audio_files.append(file_path)
            
            # Load corresponding metadata
            metadata_file = file_path.with_suffix('.json')
            if metadata_file.exists():
                import json
                with open(metadata_file, 'r') as f:
                    metadata = json.load(f)
                    metadata_files.append(metadata)
        
        return {
            'dataset_name': dataset_name,
            'audio_files': audio_files,
            'metadata': metadata_files,
            'total_files': len(audio_files)
        }
    
    def preprocess_audio(self, audio_path: str, target_sr: int = 22050) -> Tuple[np.ndarray, int]:
        """Preprocess audio file for model input."""
        try:
            # Load audio
            audio, sr = librosa.load(audio_path, sr=target_sr)
            
            # Normalize
            audio = audio / np.max(np.abs(audio))
            
            return audio, sr
        except Exception as e:
            logger.error(f"Failed to preprocess {audio_path}: {e}")
            return np.array([]), 0
    
    def create_training_split(self, dataset_name: str, train_ratio: float = 0.8) -> Dict[str, List[str]]:
        """Create train/validation split for the dataset."""
        dataset_info = self.load_dataset(dataset_name)
        
        if not dataset_info:
            return {}
        
        audio_files = [str(f) for f in dataset_info['audio_files']]
        
        # Shuffle files
        np.random.shuffle(audio_files)
        
        # Split
        split_idx = int(len(audio_files) * train_ratio)
        train_files = audio_files[:split_idx]
        val_files = audio_files[split_idx:]
        
        return {
            'train': train_files,
            'validation': val_files,
            'total_train': len(train_files),
            'total_validation': len(val_files)
        }
    
    def get_dataset_statistics(self, dataset_name: str) -> Dict[str, Any]:
        """Get statistics about the dataset."""
        dataset_info = self.load_dataset(dataset_name)
        
        if not dataset_info:
            return {}
        
        # Analyze labels
        labels = [meta['label'] for meta in dataset_info['metadata']]
        label_counts = pd.Series(labels).value_counts()
        
        # Calculate durations
        durations = [meta['duration'] for meta in dataset_info['metadata']]
        
        return {
            'total_files': len(dataset_info['audio_files']),
            'label_distribution': label_counts.to_dict(),
            'total_duration': sum(durations),
            'avg_duration': np.mean(durations),
            'min_duration': min(durations),
            'max_duration': max(durations)
        }

# Example usage and testing
if __name__ == "__main__":
    # Initialize dataset manager
    manager = SleepDatasetManager()
    
    # Download mock datasets
    print("Downloading PhysioNet Sleep-EDF dataset...")
    manager.download_dataset('physionet_sleep_edf')
    
    print("Downloading SHHS dataset...")
    manager.download_dataset('shhs')
    
    # Load dataset
    print("\nLoading PhysioNet dataset...")
    physionet_data = manager.load_dataset('physionet_sleep_edf')
    print(f"Loaded {physionet_data['total_files']} files")
    
    # Get statistics
    print("\nPhysioNet Statistics:")
    stats = manager.get_dataset_statistics('physionet_sleep_edf')
    for key, value in stats.items():
        print(f"  {key}: {value}")
    
    # Create training split
    print("\nCreating training split...")
    split = manager.create_training_split('physionet_sleep_edf')
    print(f"Training files: {split['total_train']}")
    print(f"Validation files: {split['total_validation']}")
    
    print("\nDataset integration setup complete!")
