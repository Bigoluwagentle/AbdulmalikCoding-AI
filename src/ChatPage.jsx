import { GoogleGenAI } from "@google/genai";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useRef } from "react";
import VoiceRecorder from "./components/Recorder";
import AudioWaves from "./components/AudioWave";
import Loader from "./components/Loader";

const ChatPage = () => {
    const [prompt, setPrompt] = useState("");
    const [chats, setChats] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    

    const parRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(prompt.length < 3){
            return;
        }

        console.log("Submitted")


        const newChatId = new Date().getTime();
        const newChat = {id: newChatId, question: prompt, answer: ""};
        setChats(currentChats => [...currentChats, newChat]);
        parRef.current?.scrollIntoView({behaviour: "smooth"})
        try {
            const ai = new GoogleGenAI({apiKey:"AIzaSyAqistwF-_m87F9RBQ52FjasZk0IOqSxdk"});
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `return code where neccessary and explanation when asking question.  : ${prompt}`
            });
            setPrompt("");
            setChats(currentChats => currentChats.map(chat => {
                return chat.id === newChatId ? {...chat, answer: response.text} : chat
            }))
           
        } catch(error){
            console.log(error);
        }

    }

    useEffect(() => {
        setChats(chats)
    }, [chats])


    return (
        <>
            <header>
                <h3>Abdulmalik coding <span>AI</span></h3>
            </header>

            <main>
                {
                    chats.length < 1 && 
                    <>
                        <h1>Ask your question about programming</h1>
                        <p>Type or record a vn of a programming you are worried about.</p>

                    </>
                }
                

                <div className="chats">
                    {
                        chats.map((chat) => {
                            return (
                                <div key={chat.id} className="chat-container">
                                    <div className="question flex"><div className="que">{chat.question}</div></div>
                                    {
                                        chat.answer ?
                                        <div className="answer flex">
                                            <div><p><Markdown>{chat.answer}</Markdown></p></div>
                                        </div>
                                        :
                                        <Loader />
                                    }
                                    
                                </div>
                            )
                        })
                    }
                </div>
                <p ref={parRef}></p>

                <form onSubmit={handleSubmit}>
                    <div  className="flex">
                        {
                            isRecording ?
                            <AudioWaves />
                            :
                             <input placeholder="How can i help you today" value={prompt} onChange={e => setPrompt(e.target.value)}/>
                        }

                        <div className="flex">
                            <VoiceRecorder isRecording={isRecording} setIsRecording={setIsRecording} setTranscript={setPrompt} />
                            <i className={`fa-solid fa-arrow-up ` + (prompt.length >= 3 && "active")} onClick={handleSubmit}></i>
                        </div>
                    </div>
                </form>
            </main>
        </>
    )
}

export default ChatPage;