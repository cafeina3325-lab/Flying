import { Suspense } from 'react';
import FaqAccordion from '@/components/FaqAccordion';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'FAQ | Flying Studio',
    description: 'Frequently Asked Questions regarding booking, design, and aftercare.',
};

// Colors for highlighting are handled via Tailwind classes in the data content
const highlight = (text: string) => <span className="text-gold-antique font-semibold">{text}</span>;

const FAQ_GROUPS = [
    {
        title: "예약 / 상담",
        items: [
            {
                id: "group1-1",
                question: "온라인 예약은 시술 예약인가요?",
                answer: <>아닙니다. 온라인 예약은 {highlight("대면 상담")} 예약이며, 시술은 상담 후 아티스트님의 판단과 협의를 통해 결정됩니다.</>
            },
            {
                id: "group1-2",
                question: "상담만 진행해도 되나요?",
                answer: "가능합니다. 상담 후 시술을 진행하지 않으셔도 불이익은 없습니다."
            },
            {
                id: "group1-3",
                question: "시술 날짜는 언제 정해지나요?",
                answer: "시술 날짜는 대면 상담 후 결정됩니다."
            }
        ]
    },
    {
        title: "예약금 / 취소",
        items: [
            {
                id: "group2-1",
                question: "예약금은 왜 필요한가요?",
                answer: "예약금은 노쇼 방지를 위한 금액이며, 상담 일정 확보를 위한 비용입니다."
            },
            {
                id: "group2-2",
                question: "예약금 환불이 가능한가요?",
                answer: <>고객님의 단순 변심 또는 무단 불참 시 예약금은 {highlight("환불되지 않습니다")}.</>
            },
            {
                id: "group2-3",
                question: "상담 일정 변경은 가능한가요?",
                answer: "사전 문의를 통해 일정 변경은 가능하나, 당일 취소 및 무단 불참 시 예약금은 반환되지 않습니다."
            }
        ]
    },
    {
        title: "디자인 / 결과",
        items: [
            {
                id: "group3-1",
                question: "레퍼런스와 동일하게 시술되나요?",
                answer: <>{highlight("참고용")} 이미지는 실제 시술 시 피부 상태와 시술 부위에 따라 조정될 수 있습니다.</>
            },
            {
                id: "group3-2",
                question: "사진과 결과가 다를 수 있나요?",
                answer: "개인의 피부 상태, 부위, 관리 상태에 따라 결과에는 차이가 발생할 수 있습니다."
            },
            {
                id: "group3-3",
                question: "결과가 마음에 들지 않으면 환불되나요?",
                answer: <>시술 결과에 대한 {highlight("개인적 만족도")}는 환불 또는 법적 책임의 대상이 아닙니다.</>
            }
        ]
    },
    {
        title: "시술 전 / 후 주의사항",
        items: [
            {
                id: "group4-1",
                question: "시술 전에 피해야 할 것이 있나요?",
                answer: "음주, 과도한 카페인 섭취, 수면 부족은 피하시는 것을 권장합니다."
            },
            {
                id: "group4-2",
                question: "시술 후 술을 마셔도 되나요?",
                answer: "시술 후 24~48시간 동안은 음주를 권장하지 않습니다."
            },
            {
                id: "group4-3",
                question: "시술 후 관리는 어떻게 하나요?",
                answer: "안내받은 Aftercare 지침을 준수해 주셔야 하며, 이를 따르지 않아 발생한 문제에 대해서는 책임을 지지 않습니다."
            }
        ]
    }
];

export default function FaqPage() {
    return (
        <main className="min-h-screen bg-forest-black text-white-main tracking-wide">
            <NavBar />

            <div className="container max-w-4xl mx-auto pt-48 pb-24 px-6 sm:px-8">

                {/* A) Hero / Title Block */}
                <header className="mb-20 text-center">
                    <h1 className="text-2xl sm:text-4xl font-black mb-6 uppercase tracking-[0.1em] text-white-main">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-white-dim text-sm sm:text-base tracking-widest font-light mb-8">
                        상담 및 시술 전 반드시 확인해 주시기 바랍니다.
                    </p>
                    <div className="h-px w-32 mx-auto bg-gold-antique opacity-30"></div>
                </header>

                {/* B) Legal Intro Notice (Static Card) */}
                <section className="mb-24">
                    <div className="relative rounded-xl bg-[#3A2A1F]/35 border border-[rgba(181,154,90,0.18)] backdrop-blur-md p-8 sm:p-10 text-center shadow-lg">
                        <p className="text-white-soft text-sm sm:text-base leading-loose break-keep font-light">
                            본 페이지의 내용은 상담 및 시술 진행 전 안내 사항이며,<br className="hidden sm:block" />
                            예약 접수 시 이에 동의한 것으로 간주됩니다.
                        </p>
                    </div>
                </section>

                {/* C) Accordion FAQ (Grouped) */}
                <section className="space-y-16">
                    {FAQ_GROUPS.map((group, idx) => (
                        <div key={idx}>
                            <h3 className="text-gold-soft text-xs font-bold tracking-[0.2em] uppercase mb-6 pl-2 border-l-2 border-gold-antique/30">
                                {group.title}
                            </h3>
                            <FaqAccordion items={group.items} />
                        </div>
                    ))}
                </section>

                {/* D) Bottom Final Notice */}
                <section className="mt-32 pt-12 border-t border-[#3A2A1F] text-center">
                    <p className="text-xs sm:text-sm text-white-dim/60 leading-loose break-keep tracking-widest">
                        위 내용을 충분히 확인하신 후<br />
                        상담 예약을 진행해 주시기 바랍니다.
                    </p>
                </section>

            </div>

            <Footer />
        </main>
    );
}
