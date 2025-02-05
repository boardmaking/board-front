import React from 'react';
import {useParams} from "react-router-dom";
import BoardForm from "../../components/board/BoardForm.jsx";

function BoardModifyPage() {
    const {id} = useParams();
    return (
        <BoardForm id={id} isEdit />
    );
}

export default BoardModifyPage;