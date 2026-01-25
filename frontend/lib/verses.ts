import { BibleVerse } from "@/types";

export const verses: BibleVerse[] = [
	{
		text: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라",
		ref: "요한복음 3:16",
	},
	{
		text: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라",
		ref: "빌립보서 4:13",
	},
	{
		text: "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라",
		ref: "이사야 41:10",
	},
	{
		text: "항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라",
		ref: "데살로니가전서 5:16-18",
	},
	{ text: "여호와는 나의 목자시니 내게 부족함이 없으리로다", ref: "시편 23:1" },
	{
		text: "구하라 그리하면 너희에게 주실 것이요 찾으라 그리하면 찾아낼 것이요",
		ref: "마태복음 7:7",
	},
	{
		text: "너희는 세상의 빛이라 산 위에 있는 동네가 숨겨지지 못할 것이요",
		ref: "마태복음 5:14",
	},
];

export function getDailyVerse(): BibleVerse {
	const today = new Date();
	const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));

	const verseIndex = dayIndex % verses.length;

	return verses[verseIndex];
}
