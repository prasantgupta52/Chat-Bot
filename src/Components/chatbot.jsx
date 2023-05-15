import React, { useState } from 'react';
import axios from 'axios';
const OPENAI_SECRET_CODE = process.env.REACT_APP_OPENAI_SECRET_CODE;

const Chatbot = () => {
  
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [questions, setQuestions] = useState([]);
  
  const sendMessage = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') {
      return;
    }
    
    const message = { role: 'user', content: inputValue};

    setQuestions([...questions,message]);
    
    setMessages([...messages, message]);
    setInputValue('');
    
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [...messages, message],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_SECRET_CODE}`,
          },
        }
      );
      
      const reply = response.data.choices[0].message.content;
      const botMessage = { role: 'assistant', content: reply };
      
      setMessages([...messages, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div className="chat-history">
        {messages.map((message, index) => (
          <div key={index} className='chat'>
            <div className={questions[index].role}>
             {questions[index].content}
            </div>
            {
            message.content===questions[index].content?(<div className='assistant'>wait while response is generating......</div>):(
              <div className={message.role}>
                {message.content}
              </div>)
            }
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </form>
    </div>
  );


};

export default Chatbot