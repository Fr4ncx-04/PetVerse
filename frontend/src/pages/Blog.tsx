import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { Search, Calendar, User, Tag, ChevronRight } from 'lucide-react';

const SkeletonBlogPost: React.FC = () => {
	const { theme } = useThemeLanguage();
	const bgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
	const pulseColor = theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300';

	return (
		<motion.article
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className={`rounded-lg overflow-hidden shadow-lg ${bgColor} animate-pulse`}
		>
			<div className={`w-full h-48 ${pulseColor}`} />
			<div className="p-6">
				<div className="flex items-center text-sm mb-4">
					<div className={`w-24 h-4 rounded ${pulseColor} mr-4`} />
					<div className={`w-24 h-4 rounded ${pulseColor}`} />
				</div>
				<div className={`h-6 w-3/4 rounded ${pulseColor} mb-2`} />
				<div className={`h-4 w-full rounded ${pulseColor} mb-2`} />
				<div className={`h-4 w-5/6 rounded ${pulseColor} mb-4`} />
				<div className="flex items-center justify-between">
					<div className={`w-20 h-4 rounded ${pulseColor}`} />
					<div className={`w-24 h-6 rounded-full ${pulseColor}`} />
				</div>
			</div>
		</motion.article>
	);
};

const Blog = () => {
	const { theme, language } = useThemeLanguage();
	const [searchTerm, setSearchTerm] = useState('');
	const [blogPosts, setBlogPosts] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const staticBlogPosts = [
		{
			id: 1,
			title: language === 'en' ? 'Essential Pet Care Tips' : 'Consejos Esenciales para el Cuidado de Mascotas',
			excerpt: language === 'en'
				? 'Learn the basics of keeping your pet healthy and happy'
				: 'Aprende lo básico para mantener a tu mascota saludable y feliz',
			date: '2024-03-15',
			author: language === 'en' ? 'Dr. Smith' : 'Dr. García',
			category: language === 'en' ? 'Pet Care' : 'Cuidado de Mascotas',
			image: 'https://images.pexels.com/photos/1904105/pexels-photo-1904105.jpeg',
		},
		{
			id: 2,
			title: language === 'en' ? 'Training Your New Puppy' : 'Entrenando a tu Nuevo Cachorro',
			excerpt: language === 'en'
				? 'A comprehensive guide to puppy training basics'
				: 'Una guía completa sobre el entrenamiento básico de cachorros',
			date: '2024-03-14',
			author: language === 'en' ? 'Jane Wilson' : 'Ana Martínez',
			category: language === 'en' ? 'Training' : 'Entrenamiento',
			image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
		},
		{
			id: 3,
			title: language === 'en' ? 'Nutrition Guide for Cats' : 'Guía de Nutrición para Gatos',
			excerpt: language === 'en'
				? 'Everything you need to know about feeding your cat properly'
				: 'Todo lo que necesitas saber sobre la alimentación adecuada de tu gato',
			date: '2024-03-13',
			author: language === 'en' ? 'Dr. Johnson' : 'Dr. Rodríguez',
			category: language === 'en' ? 'Nutrition' : 'Nutrición',
			image: 'https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg',
		},
	];

	useEffect(() => {
		setLoading(true);
		const loadTimer = setTimeout(() => {
			setBlogPosts(staticBlogPosts);
			setLoading(false);
		}, 1500);
		return () => clearTimeout(loadTimer);
	}, [language]);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const filteredPosts = loading
		? []
		: blogPosts.filter(
				(post) =>
					post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div
			className={`min-h-screen pt-24 px-4 ${
				theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
			}`}
		>
			<div className="max-w-7xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-12"
				>
					<h1 className="text-4xl font-bold mb-4">
						{language === 'en' ? 'Pet Care Blog' : 'Blog de Cuidado de Mascotas'}
					</h1>
					<p
						className={`text-lg ${
							theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
						}`}
					>
						{language === 'en'
							? 'Latest tips and advice for pet owners'
							: 'Últimos consejos y recomendaciones para dueños de mascotas'}
					</p>
				</motion.div>

				<div className="mb-8">
					<div className="relative max-w-xl mx-auto">
						<input
							type="text"
							placeholder={language === 'en' ? 'Search articles...' : 'Buscar artículos...'}
							value={searchTerm}
							onChange={handleSearchChange}
							className={`w-full px-4 py-2 pl-10 rounded-lg ${
								theme === 'dark'
									? 'bg-gray-800 border-gray-700 text-white'
									: 'bg-gray-200 border-gray-300 text-gray-800'
							} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
						/>
						<Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
					</div>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{loading
						? Array.from({ length: 3 }).map((_, i) => <SkeletonBlogPost key={i} />)
						: filteredPosts.map((post) => (
								<motion.article
									key={post.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5 }}
									className={`rounded-lg overflow-hidden shadow-lg ${
										theme === 'dark' ? 'bg-gray-800' : 'bg-white'
									}`}
								>
									<img
										src={post.image}
										alt={post.title}
										className="w-full h-48 object-cover"
									/>
									<div className="p-6">
										<div className="flex items-center text-sm mb-4">
											<Calendar size={16} className="mr-2" />
											<span>{new Date(post.date).toLocaleDateString()}</span>
											<User size={16} className="ml-4 mr-2" />
											<span>{post.author}</span>
										</div>
										<h2 className="text-xl font-semibold mb-2">{post.title}</h2>
										<p className="text-sm mb-4">{post.excerpt}</p>
										<div className="flex items-center justify-between text-sm">
											<div className="flex items-center">
												<Tag size={16} className="mr-1" />
												<span>{post.category}</span>
											</div>
											<button className="flex items-center text-blue-500 hover:underline">
												{language === 'en' ? 'Read more' : 'Leer más'}
												<ChevronRight size={16} className="ml-1" />
											</button>
										</div>
									</div>
								</motion.article>
						))}
				</div>
			</div>
		</div>
	);
};

export default Blog;
