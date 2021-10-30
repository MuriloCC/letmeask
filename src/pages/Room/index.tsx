import { push, ref, set } from '@firebase/database';
import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';

import logoImg from '../../assets/logo.svg'
import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../services/firebase';

import '../../styles/room.scss'

type RoomParams = {
    id: string
}

export function Room(){
    const { user } = useAuth();
    const params = useParams<RoomParams>();
    const roomId = params.id
    const [newQuestion, setNewQuestion] = useState('');

    async function handlSendQuestion(event: FormEvent){
        event.preventDefault();

        if(newQuestion.trim() === ''){
            return;
        }

        if(!user){
            throw new Error('You must be logged in')
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighLighted: false,
            isAnswered: false
        };

        const questionListRef = ref(db, `rooms/${roomId}/questions`);
        const newQuestionRef = push(questionListRef);

        await set(newQuestionRef, question);

        setNewQuestion('');
        
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <RoomCode code={roomId} />
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala React</h1>
                    <span>4 perguntas</span>
                </div>

                <form onSubmit={handlSendQuestion}>
                    <textarea 
                        placeholder="o que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faça seu login</button></span>
                        ) }
                        <Button 
                            type="submit" 
                            title="Enviar Pergunta" 
                            disabled={!user}
                        />
                    </div>
                </form>
            </main>
        </div>
    );
}