import React from "react";
import Card from "../Card/Card";

const Body = ({ audiobooks,isLoggedIn,setIsLoggedIn}) => {
    return (
        <div className="body-container">
            { (
                <div className="audiobooks-list">
                    {audiobooks.map((audiobook) => (
                        <Card
                            key={audiobook.id}
                            _id={audiobook._id}
                            id={audiobook.id}
                            title={audiobook.title}
                            author={audiobook.author}
                            genre={audiobook.genre}
                            imageUrl={audiobook.imageUrl}
                            audiobook={audiobook}
                            isLoggedIn={isLoggedIn}
                            setIsLoggedIn={setIsLoggedIn}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Body;