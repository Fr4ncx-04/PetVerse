import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useInView } from 'react-intersection-observer';
import { MessageCircle,
    Heart,
    Share2,
    Send,
    Search,
    MoreVertical
} from 'lucide-react';

// --- Interfaces ---
interface Comment {
    id: number;
    author: string;
    content: string;
    likes: number;
    timestamp: string;
    replies: Reply[];
    isLiked?: boolean;
    avatar?: string;
}

interface Reply {
    id: number;
    author: string;
    content: string;
    likes: number;
    timestamp: string;
    isLiked?: boolean;
    avatar?: string;
}

// --- Skeleton Loader ---
const SkeletonComment: React.FC = () => {
    const { theme } = useThemeLanguage();
    const bgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
    const pulseColor = theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300';

    return (
        <div className={`p-4 rounded-lg shadow-sm ${bgColor} animate-pulse`}>
            <div className="flex items-center mb-3">
                <div className={`w-10 h-10 rounded-full ${pulseColor} mr-3`}></div>
                <div>
                    <div className={`h-4 w-32 rounded ${pulseColor} mb-1`}></div>
                    <div className={`h-3 w-24 rounded ${pulseColor}`}></div>
                </div>
            </div>
            <div className={`h-4 w-full rounded ${pulseColor} mb-2`}></div>
            <div className={`h-4 w-5/6 rounded ${pulseColor} mb-4`}></div>
            <div className="flex items-center gap-4">
                <div className={`h-4 w-12 rounded ${pulseColor}`}></div>
                <div className={`h-4 w-12 rounded ${pulseColor}`}></div>
            </div>
        </div>
    );
};


// --- Reply Item Component ---
interface ReplyItemProps {
    reply: Reply;
    // Corrected: onLikeReply now receives the reply ID directly
    onLikeReply: (replyId: number) => void;
    theme: string;
    language: string;
}

const ReplyItem: React.FC<ReplyItemProps> = ({ reply, onLikeReply, theme, language }) => {
    const bgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
    const textColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
    const timestampColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`p-3 rounded-lg ${bgColor} ${textColor}`}
        >
            <div className="flex items-center mb-2">
                <div className="w-7 h-7 rounded-full bg-green-400 flex items-center justify-center text-white text-sm font-bold mr-2">
                    {reply.author.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h4 className="font-semibold text-sm">{reply.author}</h4>
                    <p className={`text-xs ${timestampColor}`}>
                        {new Date(reply.timestamp).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES')}
                    </p>
                </div>
            </div>
            <p className="mb-2 text-sm">{reply.content}</p>
            <button
                // Call the onLikeReply prop with the reply's ID
                onClick={() => onLikeReply(reply.id)}
                className={`flex items-center gap-1 text-xs transition-colors ${reply.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
                <Heart size={14} fill={reply.isLiked ? 'currentColor' : 'none'} />
                <span>{reply.likes}</span>
            </button>
        </motion.div>
    );
};

// --- Comment Item Component ---
interface CommentItemProps {
    comment: Comment;
    theme: string;
    language: string;
    user: any;
    onLikeComment: (commentId: number) => void;
    // Corrected: Added onLikeReply prop to CommentItemProps
    onLikeReply: (commentId: number, replyId: number) => void;
    onReplyClick: (commentId: number) => void;
    onSubmitReply: (commentId: number, replyContent: string) => void;
    isReplying: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    theme,
    language,
    user,
    onLikeComment,
    // Corrected: Receive onLikeReply as a prop
    onLikeReply,
    onReplyClick,
    onSubmitReply,
    isReplying,
}) => {
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });

    const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
    const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const timestampColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

    const [replyContent, setReplyContent] = useState('');

    const handleReplySubmit = () => {
        onSubmitReply(comment.id, replyContent);
        setReplyContent('');
    };

    //Variantes de animaciones para comentarios
    const commentVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };


    return (
        <motion.div
            ref={ref}
            variants={commentVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            layout
            className={`p-6 rounded-lg shadow-md ${bgColor} ${textColor}`}
        >
            {/* Comment header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg mr-3">
                        {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-bold">{comment.author}</h3>
                        <p className={`text-sm ${timestampColor}`}>
                            {new Date(comment.timestamp).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES')}
                        </p>
                    </div>
                </div>
                <button className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                    <MoreVertical size={20} />
                </button>
            </div>

            {/* Comment content */}
            <p className="mb-4 text-base leading-relaxed">{comment.content}</p>

            {/* Comment actions */}
            <div className="flex items-center gap-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-3">
                <button
                    onClick={() => onLikeComment(comment.id)}
                    className={`flex items-center gap-1 text-sm transition-colors ${comment.isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-300 hover:text-red-500'}`}
                >
                    <Heart size={18} fill={comment.isLiked ? 'currentColor' : 'none'} />
                    <span>{comment.likes}</span>
                </button>
                <button
                    onClick={() => onReplyClick(comment.id)}
                    className={`flex items-center gap-1 text-sm transition-colors ${isReplying ? 'text-green-600' : 'text-gray-600 dark:text-gray-300 hover:text-green-600'}`}
                >
                    <MessageCircle size={18} />
                    <span>{comment.replies.length} {language === 'en' ? 'Replies' : 'Respuestas'}</span>
                </button>
                <button className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors">
                    <Share2 size={18} />
                    <span>{language === 'en' ? 'Share' : 'Compartir'}</span>
                </button>
            </div>

            {/* Reply input */}
            <AnimatePresence>
                {isReplying && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-2 items-center mb-4"
                    >
                         {/* User Avatar (if logged in) */}
                        {user && user.UserName && (
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                {user.UserName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <input
                            type="text"
                            placeholder={language === 'en' ? 'Write a reply...' : 'Escribe una respuesta...'}
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className={`flex-1 px-4 py-2 rounded-full border ${
                                theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        />
                        <button
                            onClick={handleReplySubmit}
                            disabled={!replyContent.trim()}
                            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        >
                            <Send size={20} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Replies */}
            {comment.replies.length > 0 && (
                <div className="ml-8 space-y-4 border-l border-gray-300 dark:border-gray-700 pl-4">
                    {comment.replies.map((reply) => (
                        <ReplyItem
                            key={reply.id}
                            reply={reply}
                            // Corrected: Pass the onLikeReply prop received by CommentItem
                            onLikeReply={(replyId) => onLikeReply(comment.id, replyId)}
                            theme={theme}
                            language={language}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
};


const Forums = () => {
    // Contexts
    const { theme, language } = useThemeLanguage();
    const { user, isLoggedIn } = useAuth();

    // State variables
    const [searchTerm, setSearchTerm] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // Effects (Simulated Fetch)
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            // Static data - replace with API call in a real app
            const fetchedComments: Comment[] = [
                {
                    id: 1,
                    author: 'John Smith',
                    content: language === 'en' ? 'My dog loves this new toy! Any recommendations for durable chew toys for large breeds?' : '¡A mi perro le encanta este nuevo juguete! ¿Alguna recomendación de juguetes masticables duraderos para razas grandes?',
                    likes: 15,
                    timestamp: '2024-03-15T10:30:00',
                    replies: [
                        {
                            id: 1,
                            author: 'Maria Garcia',
                            content: language === 'en' ? 'Which toy is it? My golden retriever destroys everything!' : '¿Qué juguete es? ¡Mi golden retriever destruye todo!',
                            likes: 5,
                            timestamp: '2024-03-15T11:00:00',
                            isLiked: false,
                            avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
                        },
                        {
                            id: 2,
                            author: 'Pet Expert',
                            content: language === 'en' ? 'For large breeds, consider KONG Extreme or Nylabone DuraChew!' : 'Para razas grandes, ¡considera KONG Extreme o Nylabone DuraChew!',
                            likes: 12,
                            timestamp: '2024-03-15T11:15:00',
                            isLiked: false,
                            avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
                        }
                    ],
                    isLiked: false,
                    avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
                },
                {
                    id: 2,
                    author: 'Veterinarian',
                    content: language === 'en' ? 'Remember to check your pet\'s teeth regularly for signs of dental issues!' : '¡Recuerden revisar los dientes de su mascota regularmente para detectar signos de problemas dentales!',
                    likes: 25,
                    timestamp: '2024-03-16T09:00:00',
                    replies: [],
                    isLiked: false,
                    avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
                }
            ];
            setComments(fetchedComments);
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [language]);

    // Handler Functions
    const handleLikeComment = (commentId: number) => {
        if (!isLoggedIn) {
            alert(language === 'en' ? 'Please log in to like comments.' : 'Por favor, inicia sesión para dar "Me gusta".');
            return;
        }
        setComments(comments.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                    isLiked: !comment.isLiked
                };
            }
            return comment;
        }));
    };

    // Corrected: This function is defined here and passed down
    const handleLikeReply = (commentId: number, replyId: number) => {
        if (!isLoggedIn) {
            alert(language === 'en' ? 'Please log in to like replies.' : 'Por favor, inicia sesión para dar "Me gusta" a las respuestas.');
            return;
        }
        setComments(comments.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    replies: comment.replies.map(reply => {
                        if (reply.id === replyId) {
                            return {
                                ...reply,
                                likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                                isLiked: !reply.isLiked
                            };
                        }
                        return reply;
                    })
                };
            }
            return comment;
        }));
    };

    const handleSubmitComment = () => {
        if (!newComment.trim() || !isLoggedIn || !user) {
            if (!isLoggedIn) {
                alert(language === 'en' ? 'Please log in to post a comment.' : 'Por favor, inicia sesión para publicar un comentario.');
            }
            return;
        }

        const newCommentObj: Comment = {
            id: comments.length > 0 ? Math.max(...comments.map(c => c.id)) + 1 : 1,
            author: user.UserName || 'Usuario Anónimo',
            content: newComment,
            likes: 0,
            timestamp: new Date().toISOString(),
            replies: [],
            isLiked: false,
            // avatar: user.AvatarUrl
        };

        setComments([newCommentObj, ...comments]);
        setNewComment('');
    };

    const handleReplyClick = (commentId: number) => {
        if (!isLoggedIn) {
            alert(language === 'en' ? 'Please log in to reply.' : 'Por favor, inicia sesión para responder.');
            return;
        }
        setReplyingTo(replyingTo === commentId ? null : commentId);
    };

    const handleSubmitReply = (commentId: number, replyContent: string) => {
        if (!replyContent.trim() || !isLoggedIn || !user) {
            if (!isLoggedIn) {
                alert(language === 'en' ? 'Please log in to post a reply.' : 'Por favor, inicia sesión para publicar una respuesta.');
            }
            return;
        }

        setComments(comments.map(comment => {
            if (comment.id === commentId) {
                const newReplyObj: Reply = {
                    id: comment.replies.length > 0 ? Math.max(...comment.replies.map(r => r.id)) + 1 : 1,
                    author: user.UserName || 'Usuario Anónimo',
                    content: replyContent,
                    likes: 0,
                    timestamp: new Date().toISOString(),
                    isLiked: false,
                    // avatar: user.AvatarUrl
                };
                return {
                    ...comment,
                    replies: [...comment.replies, newReplyObj]
                };
            }
            return comment;
        }));

        setReplyingTo(null);
    };

    // Derived state / Filtered data
    const filteredComments = comments.filter(comment =>
        comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.replies.some(reply =>
            reply.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reply.author.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Render JSX
    return (
        <div className={`min-h-screen pt-24 pb-12 px-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
            <div className="max-w-3xl mx-auto">
            {/* Page Title */}
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl font-bold text-center mb-8 text-green-700 dark:text-green-400"
                >
                    {language === 'en' ? 'PetVerse Community Forum' : 'Foro de la Comunidad PetVerse'}
                </motion.h1>

                {/* Search and New Comment Section */}
                <div className="sticky top-20 z-10 bg-inherit pb-4">
                    {/* Search Input */}
                    <div className="relative mb-4">
                        <input
                        type="text"
                        placeholder={language === 'en' ? 'Search discussions...' : 'Buscar discusiones...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full px-4 py-2 pl-10 rounded-full border ${
                            theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={20} />
                    </div>

                    {/* New comment input */}
                    {isLoggedIn ? (
                    <div className={`flex gap-2 p-4 rounded-lg mb-6 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
                        {user && user.UserName && (
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {user.UserName.charAt(0).toUpperCase()}
                        </div>
                        )}
                        <input
                        type="text"
                        placeholder={language === 'en' ? 'Start a new discussion...' : 'Iniciar una nueva discusión...'}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className={`flex-1 px-4 py-2 rounded-full border ${
                            theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}                  />
                        <button
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim()}
                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        >
                        <Send size={20} />
                        </button>
                    </div>
                    ) : (
                        <div className={`p-4 text-center rounded-lg mb-6 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
                            <p className="text-gray-600 dark:text-gray-300">
                                {language === 'en' ? 'Log in to start a new discussion or reply to comments.' : 'Inicia sesión para iniciar una nueva discusión o responder a los comentarios.'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Comments feed */}
                <div className="space-y-6">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, index) => <SkeletonComment key={index} />)
                    ) : (
                    filteredComments.map((comment) => (
                    <CommentItem
                    key={comment.id}
                    comment={comment}
                    theme={theme}
                    language={language}
                    user={user}
                    onLikeComment={handleLikeComment}
                    onLikeReply={handleLikeReply} // Corrected: Pass handleLikeReply down
                    onReplyClick={handleReplyClick}
                    onSubmitReply={handleSubmitReply}
                    isReplying={replyingTo === comment.id}
                    />
                    ))
                    )}

                    {!loading && filteredComments.length === 0 && comments.length > 0 && (
                        <div className={`p-4 text-center rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
                            <p className="text-gray-600 dark:text-gray-300">
                                {language === 'en' ? 'No results found for your search.' : 'No se encontraron resultados para tu búsqueda.'}
                            </p>
                        </div>
                    )}
                    {!loading && comments.length === 0 && (
                        <div className={`p-4 text-center rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
                            <p className="text-gray-600 dark:text-gray-300">
                                {language === 'en' ? 'No discussions yet. Be the first to start one!' : 'Aún no hay discusiones. ¡Sé el primero en iniciar una!'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Forums;
