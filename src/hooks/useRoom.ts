import { onValue, ref } from "@firebase/database";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionType = {
    id: string,
    author: {
        name: string,
        avatar: string,
    }
    content: string,
    isAnswered: boolean,
    isHighLighted: boolean,
    likeCount: number,
    likeId: string | undefined
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string,
        avatar: string,
    }
    content: string,
    isAnswered: boolean,
    isHighLighted: boolean,
    likes: Record<string, {
        authorId: string
    }>
}>

export function useRoom(roomId: string){
    const { user } = useAuth();

    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const roomRef = ref(db, `rooms/${roomId}`);
        onValue(roomRef, snapshot => {
            const databaseRoom = snapshot.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return{
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighLighted: value.isHighLighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => 
                        like.authorId === user?.id)?.[0], 
                }
            });

            setQuestions(parsedQuestions);
            setTitle(databaseRoom.title);
        }); 
    }, [roomId, user?.id]);

    return { questions, title  };
}

