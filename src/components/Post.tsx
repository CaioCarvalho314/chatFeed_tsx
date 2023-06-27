import { format, formatDistanceToNow } from "date-fns";
import ptBr from "date-fns/locale/pt-BR";
import { Avatar } from "./Avatar";
import { Comment } from "./Comment";

import styles from "./Post.module.css";
import { ChangeEvent, FormEvent, InvalidEvent, useState } from "react";

interface Content {
  type: "paragraph" | "link";
  content: string;
}
interface Author {
  name: string;
  avatarUrl: string;
  role: string;
}

export interface PostType {
  id: number;
  author: Author;
  publishedAt: Date;
  content: Content[];
}
interface PostProps {
  post: PostType;
}

export function Post({ post }: PostProps) {
  const [comments, setComments] = useState([
    "NAÃO, VAI COLOCAR MEU COMENTÁRIO AÍ NÃO",
  ]);

  const [newCommentText, setNewCommentText] = useState("");

  const publishedDateFormatted = format(
    post.publishedAt,
    "d 'de' LLLL 'às' HH:mm'h'",
    {
      locale: ptBr,
    }
  );

  const publishedDateRelativeToNow = formatDistanceToNow(post.publishedAt, {
    locale: ptBr,
    addSuffix: true,
  });

  function handleNewComment(event: FormEvent) {
    event.preventDefault();
    setComments([...comments, newCommentText]);
    setNewCommentText("");
  }

  function handleCreateNewComment(event: ChangeEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity("");
    setNewCommentText(event.target.value);
  }

  function deleteComment(commentToDelete: string) {
    const commentsWithoutRemovedOne = comments.filter((comment) => {
      return comment !== commentToDelete;
    });
    setComments(commentsWithoutRemovedOne);
  }

  function handleInvalidComment(event: InvalidEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity("Esse campo é obrigatório");
  }

  const isCommentEmpty = newCommentText.length === 0;

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar hasBorder={true} src={post.author.avatarUrl} />
          <div className={styles.authorInfo}>
            <strong>{post.author.name}</strong>
            <span>{post.author.role}</span>
          </div>
        </div>
        <time
          title={publishedDateFormatted}
          dateTime={post.publishedAt.toISOString()}
        >
          {publishedDateRelativeToNow}
        </time>
      </header>

      <div className={styles.content}>
        {post.content.map((element) => {
          if (element.type === "paragraph")
            return <p key={element.content}>{element.content}</p>;
          else if (element.type === "link")
            return (
              <p key={element.content}>
                <a href="#">{element.content}</a>
              </p>
            );
        })}
      </div>

      <form onSubmit={handleNewComment} className={styles.commentForm}>
        <strong>Deixe seu comentário</strong>
        <textarea
          name="comment"
          placeholder="Escreva um comentário..."
          value={newCommentText}
          onInvalid={handleInvalidComment}
          onChange={handleCreateNewComment}
          required={true}
        />
        <footer>
          <button type="submit" disabled={isCommentEmpty}>
            Publicar
          </button>
        </footer>
      </form>
      <div className={styles.commentList}>
        {comments.map((comment) => {
          return (
            <Comment
              key={comment}
              comment={comment}
              deleteComment={deleteComment}
            />
          );
        })}
      </div>
    </article>
  );
}
