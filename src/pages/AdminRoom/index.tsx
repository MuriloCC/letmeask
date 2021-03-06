import { useParams, useHistory } from 'react-router-dom';

import logoImg from '../../assets/logo.svg'
import { Button } from '../../components/Button';
import { Question } from '../../components/Question';
import { RoomCode } from '../../components/RoomCode';
import { useRoom } from '../../hooks/useRoom';

import deleteImg from '../../assets/delete.svg';
import checkImg from '../../assets/check.svg';
import answerImg from '../../assets/answer.svg';


import '../../styles/room.scss'
import { ref, remove, update } from '@firebase/database';
import { db } from '../../services/firebase';

type RoomParams = {
    id: string
}

export function AdminRoom(){
    const params = useParams<RoomParams>();
    const history = useHistory();
    const roomId = params.id;
    const { questions, title } = useRoom(roomId);

    async function handleDeleteQuestion(questionId: string){
        if(window.confirm('Tem certeza que deseja excluir esta pergunta?')){
            const questionRef = ref(db, `rooms/${roomId}/questions/${questionId}`);

            await remove(questionRef);
        }
    }

    async function handleEndRoom(){
        const roomRef = ref(db, `rooms/${roomId}`);

        await update(roomRef, {endedAt: new Date()});

        history.push('/');
    }

    async function handleCheckQuestionAsAnswered(questionId: string){
        const questionRef = ref(db, `rooms/${roomId}/questions/${questionId}`);

        await update(questionRef, {
            isAnswered: true
        });
    }

    async function handleHighlightQuestion(questionId: string){
        const questionRef = ref(db, `rooms/${roomId}/questions/${questionId}`);

        await update(questionRef, {
            isHighLighted: true
        });
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button
                            title="Encerrar sala" 
                            isOutlined
                            onClick={handleEndRoom}
                        />
                    </div>
                    
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
                </div>

                {questions.map(question => {
                    return(
                        <Question
                            key={question.id}
                            content={question.content}
                            author={question.author}
                            isAnswered={question.isAnswered}
                            isHighLighted={question.isHighLighted}
                        >
                            {!question.isAnswered && (
                                <>
                                    <button
                                    type="button"
                                    onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                    >
                                        <img src={checkImg} alt="Marcar pergunta como respondida" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleHighlightQuestion(question.id)}
                                    >
                                        <img src={answerImg} alt="Dar destaque a pergunta" />
                                    </button>
                                </>
                            )}

                            <button
                                type="button"
                                onClick={() => handleDeleteQuestion(question.id)}
                            >
                                <img src={deleteImg} alt="Remover" />
                            </button>
                        </Question>
                    );
                })}
            </main>
        </div>
    );
}