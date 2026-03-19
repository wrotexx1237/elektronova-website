'use client';

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight, FaExternalLinkAlt } from 'react-icons/fa';
import { useLocale } from 'next-intl';

const REVIEWS_DATA: Record<string, any[]> = {
  sq: [
    {
      name: "Diamond Syla",
      rating: 5,
      content: "Kam instaluar 4 kamera sigurie dhe një sistem alarmi me ElektroNova, dhe nuk mund të jem më i kënaqur me shërbimin! Ekipi ishte profesional, punoi shpejt dhe me shumë kujdes. Kamerat u instaluan në mënyrë perfekte, me pamje të qartë dhe mbulim të plotë të hapësirës.",
      date: "1 muaj më parë"
    },
    {
      name: "Albion Smajli",
      rating: 5,
      content: "Kam pasur një problem serioz me energjinë elektrike në furrën time, i cili po shkaktonte ndërprerje të vazhdueshme dhe humbje të produkteve. Asnjë elektricist nuk mund ta zgjidhte problemin derisa erdhën djemtë nga ElektroNova. Ata e diagnostikuan shpejt problemin dhe çdo gjë tani është perfekte!",
      date: "2 muaj më parë"
    },
    {
      name: "MiLoT!",
      rating: 5,
      content: "Pata një problem me një fazë të rrymës dhe vendosa të kontaktoj ElektroNova. Ekipa erdhi shumë shpejtë, identifikoi problemin dhe e rregulloi në kohë rekord. Çdo gjë funksionon pa asnjë problem. Shërbim profesional, i shpejtë dhe shumë korrekt!",
      date: "3 javë më parë"
    },
    {
      name: "Milot Morina",
      rating: 5,
      content: "Vendosa të instaloj 4 kamera sigurie dhe një sistem alarmi Hikvision me ElektroNova, dhe ishte zgjedhja më e mirë! Kamerat kanë cilësi të shkëlqyer të imazhit, edhe natën, dhe alarmi është i klasit të parë.",
      date: "1 muaj më parë"
    },
    {
      name: "Daniel 12",
      rating: 5,
      content: "Kam instaluar një sistem alarmi me ElektroNova dhe jam shumë i kënaqur! Ekipi ishte profesional dhe i shpejtë, dhe sistemi punon pa asnjë problem. Tani ndihem shumë më i sigurt. Rekomandoj!",
      date: "2 muaj më parë"
    },
    {
      name: "Agonis Scameri",
      rating: 5,
      content: "Shërbim profesional, i shpejtë dhe shumë korrekt! Ekipi erdhi shumë shpejt, identifikoi problemin dhe e rregulloi menjëherë. I rekomandoj pa hezitim! 🔧⚡",
      date: "2 muaj më parë"
    },
    {
      name: "Iberdemaj Besi",
      rating: 5,
      content: "Shumë mirë, shumë shpejt... për punë të tjera do të kontaktojmë patjetër. Ekip profesional dhe shumë i besueshëm për çdo lloj pune elektrike.",
      date: "4 muaj më parë"
    },
    {
      name: "peja vendos",
      rating: 5,
      content: "Shumë shpejt dhe mirë! Ekip korrekt dhe punë cilësore. E transformuan sistemin tonë të sigurisë për pak orë.",
      date: "5 muaj më parë"
    },
    {
      name: "Ardit Podrimqaku",
      rating: 5,
      content: "Shërbim i shkëlqyer! Profesionalizëm në kulm. Një ndër ekipet më të mira që kemi bashkëpunuar ndonjëherë.",
      date: "6 muaj më parë"
    },
    {
      name: "Albanot Kuqi",
      rating: 5,
      content: "Top shërbim, shumë korrekt. Na kanë ndihmuar me instalimet e reja dhe çdo gjë po funksionon për mrekulli.",
      date: "7 muaj më parë"
    },
    {
      name: "loris krasniqi",
      rating: 5,
      content: "Ekip profesional, punë e pastër dhe e shpejtë. I rekomandoj për çdo lloj instalimi të kamerave dhe alarmeve.",
      date: "8 muaj më parë"
    }
  ],
  en: [
    {
      name: "Diamond Syla",
      rating: 5,
      content: "I installed 4 security cameras and an alarm system with ElektroNova, and I couldn't be more pleased with the service! The team was professional, worked quickly and with great care. The cameras were installed perfectly, with a clear view and full coverage of the space.",
      date: "1 month ago"
    },
    {
      name: "Albion Smajli",
      rating: 5,
      content: "I had a serious power problem in my bakery, which was causing constant outages and product loss. No electrician could fix the problem until the guys from ElektroNova came. They quickly diagnosed the problem and everything is now perfect!",
      date: "2 months ago"
    },
    {
      name: "MiLoT!",
      rating: 5,
      content: "I had a problem with a phase of the power supply and decided to contact ElektroNova. The team came very quickly, identified the problem and fixed it in record time. Professional, fast and very correct service! I recommend them without hesitation!",
      date: "3 weeks ago"
    },
    {
      name: "Milot Morina",
      rating: 5,
      content: "I decided to install 4 security cameras and a Hikvision alarm system with ElektroNova, and it was the best choice! The cameras have excellent image quality, even at night.",
      date: "1 month ago"
    },
    {
      name: "Daniel 12",
      rating: 5,
      content: "I installed an alarm system with ElektroNova and I am very satisfied! The team was professional and fast, and the system works without any problems. Now I feel much safer. I recommend!",
      date: "2 months ago"
    },
    {
      name: "Agonis Scameri",
      rating: 5,
      content: "Professional, fast and very correct service! I recommend them without hesitation! The team found the electrical short and fixed it immediately. 🔧⚡",
      date: "2 months ago"
    },
    {
      name: "Iberdemaj Besi",
      rating: 5,
      content: "Very good, very fast... we will definitely contact for other work. Professional team and very reliable.",
      date: "4 months ago"
    },
    {
      name: "peja vendos",
      rating: 5,
      content: "Very fast and good! Correct team and high quality work. They transformed our security setup in just a few hours.",
      date: "5 months ago"
    },
    {
      name: "Ardit Podrimqaku",
      rating: 5,
      content: "Excellent service! Peak professionalism. One of the best teams we've ever collaborated with.",
      date: "6 months ago"
    },
    {
      name: "Albanot Kuqi",
      rating: 5,
      content: "Top service, very correct. They helped us with new installations and everything is working perfectly.",
      date: "7 months ago"
    },
    {
      name: "loris krasniqi",
      rating: 5,
      content: "Professional team, clean and fast work. I recommend them for any kind of camera and alarm installation.",
      date: "8 months ago"
    }
  ]
};

const RealGoogleLogo = () => (
    <div className="flex items-center gap-1.5 grayscale brightness-200">
        <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
        </svg>
        <span className="font-heading font-extrabold text-xl tracking-tighter">Google</span>
    </div>
);

const TestimonialCard = ({ review, direction }: { review: any, direction: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            initial={{ opacity: 0, scale: 0.9, x: direction * 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -direction * 50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-2xl relative z-20 cursor-grab active:cursor-grabbing"
        >
            <div className="relative glass-card p-10 md:p-14 bg-[#0d1117]/60 border-white/10 backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.6)] rounded-[3rem] group overflow-hidden">
                {/* Visual Accent */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
                
                {/* Rating */}
                <div className="flex gap-1.5 mb-10">
                    {[...Array(review.rating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-500 text-xl drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                    ))}
                </div>

                {/* Content */}
                <div className="relative mb-12">
                    <FaQuoteLeft className="absolute -top-6 -left-4 text-primary opacity-10 text-6xl" />
                    <p className="text-xl md:text-2xl lg:text-3xl text-white italic font-medium leading-relaxed relative z-10">
                        "{review.content}"
                    </p>
                </div>

                {/* Author */}
                <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                    <div>
                        <h3 className="text-2xl font-heading font-black text-white group-hover:text-primary transition-all underline decoration-primary/0 group-hover:decoration-primary/50 underline-offset-8">
                            {review.name}
                        </h3>
                        <p className="text-primary/60 text-xs uppercase tracking-[0.3em] font-bold mt-2 flex items-center gap-2">
                            <span>Google Verified</span>
                            <span className="w-1 h-1 rounded-full bg-primary/30" />
                            <span className="text-gray-500">{review.date}</span>
                        </p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-white/40 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                        <FaExternalLinkAlt />
                    </div>
                </div>

                {/* Mouse Shine Effect */}
                <motion.div 
                    style={{ x: mouseXSpring, y: mouseYSpring }}
                    className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                />
            </div>
        </motion.div>
    );
};

export default function TestimonialSlider() {
    const locale = useLocale();
    const reviews = REVIEWS_DATA[locale] || REVIEWS_DATA.sq;
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);

    const next = () => {
        setDirection(1);
        setCurrent((prev) => (prev + 1) % reviews.length);
    };

    const prev = () => {
        setDirection(-1);
        setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    useEffect(() => {
        const timer = setInterval(() => next(), 8000);
        return () => clearInterval(timer);
    }, [reviews.length]);

    return (
        <div className="relative py-24 overflow-visible">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[600px] pointer-events-none opacity-20">
                <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[150px] animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col items-center mb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-8 p-1 px-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-4 group hover:border-primary/30 transition-all shadow-2xl"
                    >
                        <div className="bg-white/5 p-3 rounded-xl">
                            <RealGoogleLogo />
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div className="pr-6">
                            <div className="flex gap-1 text-yellow-500 mb-1">
                                {[...Array(5)].map((_, i) => <FaStar key={i} size={14} className="drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" />)}
                            </div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">11/11 Verified Reviews</p>
                        </div>
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl font-heading font-black text-center tracking-tighter leading-tight mb-6">
                        {locale === 'sq' ? 'Besimi i' : 'Trust of our'} <span className="text-primary italic">{locale === 'sq' ? 'Klientëve' : 'Clients'}</span>
                    </h2>
                    <p className="text-gray-400 text-center max-w-xl text-lg">
                        {locale === 'sq' 
                          ? 'Çfarë thonë klientët tanë rreth eksperiencës së tyre me shërbimet tona profesionale.'
                          : 'What our clients say about their experience with our professional services.'}
                    </p>
                </div>

                {/* Slider Unit */}
                <div className="relative flex items-center justify-center min-h-[500px]">
                    <AnimatePresence mode="wait" custom={direction}>
                        <TestimonialCard key={current} review={reviews[current]} direction={direction} />
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="absolute inset-0 flex items-center justify-between pointer-events-none h-full z-30 px-0 md:-mx-12 lg:-mx-24">
                        <button 
                            onClick={prev}
                            className="w-16 h-16 rounded-full bg-white/5 border border-white/10 backdrop-blur-3xl flex items-center justify-center text-white/40 hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all pointer-events-auto active:scale-90"
                            aria-label="Previous testimonial"
                        >
                            <span className="sr-only">Previous testimonial</span>
                            <FaChevronLeft size={24} aria-hidden="true" />
                        </button>
                        <button 
                            onClick={next}
                            className="w-16 h-16 rounded-full bg-white/5 border border-white/10 backdrop-blur-3xl flex items-center justify-center text-white/40 hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all pointer-events-auto active:scale-90"
                            aria-label="Next testimonial"
                        >
                            <span className="sr-only">Next testimonial</span>
                            <FaChevronRight size={24} aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-3 mt-16">
                    {reviews.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setDirection(i > current ? 1 : -1);
                                setCurrent(i);
                            }}
                            className={`h-2 rounded-full transition-all duration-500 ${
                                current === i ? "bg-primary w-12" : "bg-white/10 w-4 hover:bg-white/20"
                            }`}
                        >
                            <span className="sr-only">Go to testimonial {i + 1}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
