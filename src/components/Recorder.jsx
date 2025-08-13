import React, { useRef } from "react";

const VoiceRecorder = ({isRecording, setIsRecording, setAudioUrl, setTranscript}) => {
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recognitionRef = useRef(null);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true});
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
            audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
            // const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            // const url = URL.createObjectURL(audioBlob);
            
            // setAudioUrl(url);
            // optional
        };

        mediaRecorder.start();

        // :speaking_head_in_silhouette: Browser speech-to-text (Web Speech API)
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
         const recognition = new SpeechRecognition();
         recognition.continuous = true;
         recognition.interimResults = true;
         recognition.lang = "en-US";

         recognition.onresult = (event) => {
            const currentTranscript = Array.from(event.results)
             .map((result) => result[0].transcript)
             .join(" ");
            setTranscript(currentTranscript);
        };

        recognition.start();
        recognitionRef.current = recognition;
        } else {
        alert("Sorry, your browser does not support speech recognition.");
        }

        setIsRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();

        // Stop transcription
        if (recognitionRef.current.stop) {
            recognitionRef.current.stop();
        }
        setIsRecording(false);
    };

    return (
        <i 
        className={isRecording ? "fa-solid fa-microphone-lines-slash" : "fa-solid fa-microphone"}
        onClick={isRecording ? stopRecording: startRecording}
        ></i>
    )
};

export default VoiceRecorder;