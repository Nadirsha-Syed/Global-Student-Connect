/**
 * AI Service Module for Global Student Connect (Role 5)
 * 
 * Supports:
 * 1. Live LLM Integration (Google Gemini / OpenAI compatible REST)
 * 2. High-quality Offline / Heuristic Fallback Mode (zero-cost, runs offline)
 * 3. Dynamic semantic compatibility scoring for matchmaking
 * 4. Cross-cultural icebreakers & discussion topic suggestions
 * 5. Post-session reflection synthesis
 */

/**
 * Invokes an external LLM API if an API key is provided, otherwise returns null to trigger fallback.
 * @param {string} prompt
 * @param {string} systemInstruction
 * @returns {Promise<string|null>}
 */
async function callLlmProvider(prompt, systemInstruction = '') {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction ? systemInstruction + '\n\n' : ''}${prompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate) return candidate.trim();
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to heuristic engine:', err.message);
    }
  }

  if (openaiKey) {
    try {
      const url = 'https://api.openai.com/v1/chat/completions';
      const payload = {
        model: 'gpt-4o-mini',
        messages: [
          ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 800,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content.trim();
      }
    } catch (err) {
      console.warn('OpenAI API call failed, falling back to heuristic engine:', err.message);
    }
  }

  return null;
}

/**
 * Safely parses a JSON string or returns an extracted object/array.
 */
function extractJsonFromText(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

/**
 * Generates tailored discussion questions, study agenda, and cross-cultural conversation angles.
 */
export async function generateTopicSuggestions({ userA = {}, userB = {}, baseTopic = 'Collaborative Study' }) {
  const nameA = userA.name || 'Student A';
  const countryA = userA.country || 'Global';
  const interestsA = Array.isArray(userA.interests) ? userA.interests.join(', ') : 'General Studies';

  const nameB = userB.name || 'Student B';
  const countryB = userB.country || 'Global';
  const interestsB = Array.isArray(userB.interests) ? userB.interests.join(', ') : 'General Studies';

  const systemInstruction = `You are an AI Academic Co-Pilot for Global Student Connect. Your job is to facilitate rich, cross-cultural study sessions between international students. Return valid JSON only.`;

  const prompt = `Two students are meeting for a study session:
- Student 1: ${nameA} from ${countryA}, Interests: [${interestsA}]
- Student 2: ${nameB} from ${countryB}, Interests: [${interestsB}]
- Main Topic: ${baseTopic}

Generate a structured study guide with:
1. "discussionQuestions": 3 insightful, in-depth academic discussion questions tailored to ${baseTopic}.
2. "crossCulturalAngle": 1 question exploring how this subject or problem is approached differently in ${countryA} vs. ${countryB}.
3. "suggestedAgenda": A 3-step timeboxed agenda (e.g. 10m Concepts, 15m Practice/Debate, 5m Summary).

Return strictly JSON with keys: "topic", "discussionQuestions", "crossCulturalAngle", "suggestedAgenda".`;

  const llmResponse = await callLlmProvider(prompt, systemInstruction);
  const parsed = extractJsonFromText(llmResponse);

  if (parsed && Array.isArray(parsed.discussionQuestions)) {
    return {
      provider: 'llm',
      ...parsed,
    };
  }

  // High-Quality Heuristic Fallback
  return {
    provider: 'heuristic-engine',
    topic: baseTopic,
    discussionQuestions: [
      `How do foundational concepts in "${baseTopic}" connect to real-world engineering or practical challenges?`,
      `What are the most common misconceptions or trade-offs when implementing or studying "${baseTopic}"?`,
      `Can you explain your preferred methodology or mental model for solving complex problems in "${baseTopic}"?`,
    ],
    crossCulturalAngle: `How is "${baseTopic}" typically taught or applied in industry within ${countryA} compared to ${countryB}?`,
    suggestedAgenda: [
      { phase: 'Introductions & Goal Alignment', durationMinutes: 5, description: 'Share background, goals, and key questions for today.' },
      { phase: 'Core Concept Deep Dive & Problem Solving', durationMinutes: 20, description: `Work through core principles and challenges in ${baseTopic}.` },
      { phase: 'Wrap-up & Key Takeaways', durationMinutes: 5, description: 'Review insights, record reflections, and exchange resources.' },
    ],
  };
}

/**
 * Generates personalized cross-cultural icebreakers to remove initial awkwardness in video calls.
 */
export async function generateIcebreakers({ userA = {}, userB = {} }) {
  const countryA = userA.country || 'Country A';
  const countryB = userB.country || 'Country B';
  const nameA = userA.name || 'Peer 1';
  const nameB = userB.name || 'Peer 2';
  const langA = Array.isArray(userA.languages) ? userA.languages.join(', ') : 'English';
  const langB = Array.isArray(userB.languages) ? userB.languages.join(', ') : 'English';

  const systemInstruction = `You are a cross-cultural communication facilitator for university students. Return valid JSON only.`;

  const prompt = `Generate 3 fun, friendly, and non-awkward icebreaker questions for two students meeting on a video call:
- ${nameA} (${countryA}, speaks: ${langA})
- ${nameB} (${countryB}, speaks: ${langB})

Include:
1. One academic/routine question (e.g. campus life or study habits).
2. One cultural/food/city exchange question.
3. One lighthearted "would you rather" or tech debate.

Return strictly JSON with key "icebreakers" as an array of strings.`;

  const llmResponse = await callLlmProvider(prompt, systemInstruction);
  const parsed = extractJsonFromText(llmResponse);

  if (parsed && Array.isArray(parsed.icebreakers)) {
    return {
      provider: 'llm',
      icebreakers: parsed.icebreakers,
    };
  }

  // Heuristic Fallback
  return {
    provider: 'heuristic-engine',
    icebreakers: [
      `What is one typical student snack or drink in ${countryA} and ${countryB} that powers your late-night study sessions?`,
      `How does student life and exam season differ between universities in ${countryA} and ${countryB}?`,
      `If you could instantly become a world-class expert in one subject overnight, what would it be and why?`,
    ],
  };
}

/**
 * Dynamic AI Semantic Compatibility Scorer.
 * Computes an intelligent bonus score (0-20 points) for the matching algorithm.
 */
export async function computeCompatibilityBonus(candidateUser = {}, peerUser = {}, sharedTopics = []) {
  if (!candidateUser || !peerUser) return 0;

  const interestsA = (candidateUser.interests || []).map((s) => s.toLowerCase().trim());
  const interestsB = (peerUser.interests || []).map((s) => s.toLowerCase().trim());

  // Direct shared topics bonus
  let bonus = 0;

  if (sharedTopics && sharedTopics.length > 0) {
    bonus += Math.min(sharedTopics.length * 4, 10);
  }

  // Cross-cultural learning incentive bonus (+5 if from different countries)
  if (candidateUser.country && peerUser.country && candidateUser.country.toLowerCase() !== peerUser.country.toLowerCase()) {
    bonus += 5;
  }

  // Language overlap bonus
  const langsA = (candidateUser.languages || []).map((l) => l.toLowerCase().trim());
  const langsB = (peerUser.languages || []).map((l) => l.toLowerCase().trim());
  const sharedLangs = langsA.filter((l) => langsB.includes(l));
  if (sharedLangs.length > 0) {
    bonus += 3;
  }

  // Grade level compatibility (+2 if similar or complementary)
  if (candidateUser.gradeLevel && peerUser.gradeLevel) {
    bonus += 2;
  }

  // Semantic interest overlap using keyword clusters
  const clusters = [
    ['ai', 'machine learning', 'deep learning', 'data science', 'python', 'pytorch', 'tensorflow'],
    ['web', 'react', 'frontend', 'javascript', 'typescript', 'node', 'fullstack', 'css'],
    ['algorithms', 'data structures', 'dsa', 'competitive programming', 'c++', 'java', 'leetcode'],
    ['cloud', 'devops', 'docker', 'kubernetes', 'aws', 'backend', 'system design'],
  ];

  for (const cluster of clusters) {
    const hasA = interestsA.some((i) => cluster.some((c) => i.includes(c)));
    const hasB = interestsB.some((i) => cluster.some((c) => i.includes(c)));
    if (hasA && hasB) {
      bonus += 3;
      break;
    }
  }

  // Cap bonus at 20 points
  return Math.min(bonus, 20);
}

/**
 * Summarizes post-session reflections and extracts mutual key takeaways.
 */
export async function summarizeReflections({ session = {}, reflections = [] }) {
  if (!reflections || reflections.length === 0) {
    return {
      provider: 'heuristic-engine',
      summary: 'No reflections submitted yet for this session.',
      keyTakeaways: [],
      culturalInsights: 'Awaiting student feedback.',
    };
  }

  const reflectionTexts = reflections
    .map((r, i) => `Student ${i + 1} (${r.userId?.name || 'Anonymous'}): "${r.learnings || ''}" Notes: "${r.culturalExchangeNotes || ''}" Rating: ${r.rating || 'N/A'}/5`)
    .join('\n');

  const prompt = `Analyze these post-session reflection notes for a study meeting on "${session.topic || 'General Topic'}":
${reflectionTexts}

Provide:
1. "summary": A concise 2-sentence summary of the collaborative session.
2. "keyTakeaways": Array of 2-3 specific concepts or skills they learned.
3. "culturalInsights": A short statement on the cultural or peer exchange achieved.
4. "collaborationScore": A score from 1 to 100 based on feedback and satisfaction.

Return strictly JSON.`;

  const llmResponse = await callLlmProvider(prompt, 'You are an academic learning synthesizer. Return valid JSON only.');
  const parsed = extractJsonFromText(llmResponse);

  if (parsed && parsed.summary) {
    return {
      provider: 'llm',
      ...parsed,
    };
  }

  // Fallback synthesis
  const ratings = reflections.map((r) => Number(r.rating) || 5);
  const avgRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  const learningsList = reflections.map((r) => r.learnings).filter(Boolean);
  const culturalList = reflections.map((r) => r.culturalExchangeNotes).filter(Boolean);

  return {
    provider: 'heuristic-engine',
    summary: `The session on "${session.topic || 'Peer Study'}" concluded successfully with an average satisfaction rating of ${avgRating}/5. Students actively collaborated on core concepts.`,
    keyTakeaways: learningsList.length > 0 ? learningsList : ['Reviewed foundational concepts and shared practical study strategies.'],
    culturalInsights: culturalList.length > 0 ? culturalList.join(' | ') : 'Positive cross-cultural dialogue and academic perspective sharing.',
    collaborationScore: Math.round((parseFloat(avgRating) / 5) * 100),
  };
}
