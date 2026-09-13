import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateTopicSuggestions,
  generateIcebreakers,
  computeCompatibilityBonus,
  summarizeReflections,
} from '../src/modules/ai/services/ai.service.js';

test('Member 5 AI Module - Unit & Integration Test Suite', async (t) => {
  const mockUserA = {
    _id: '65f1a2b3c4d5e6f7a8b9c001',
    name: 'Alice Smith',
    country: 'Germany',
    timezone: 'Europe/Berlin',
    interests: ['React', 'Web Development', 'Machine Learning'],
    languages: ['German', 'English'],
    gradeLevel: 'Undergraduate',
  };

  const mockUserB = {
    _id: '65f1a2b3c4d5e6f7a8b9c002',
    name: 'Kenji Sato',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    interests: ['React', 'System Design', 'Algorithms'],
    languages: ['Japanese', 'English'],
    gradeLevel: 'Undergraduate',
  };

  await t.test('1. Topic Suggestions & Discussion Guide Generation', async () => {
    const result = await generateTopicSuggestions({
      userA: mockUserA,
      userB: mockUserB,
      baseTopic: 'Distributed Systems & React',
    });

    assert.ok(result);
    assert.equal(result.topic, 'Distributed Systems & React');
    assert.ok(Array.isArray(result.discussionQuestions));
    assert.ok(result.discussionQuestions.length >= 3);
    assert.ok(result.crossCulturalAngle);
    assert.ok(Array.isArray(result.suggestedAgenda));
    assert.ok(result.suggestedAgenda.length >= 3);
  });

  await t.test('2. Cross-Cultural Icebreakers Generation', async () => {
    const result = await generateIcebreakers({
      userA: mockUserA,
      userB: mockUserB,
    });

    assert.ok(result);
    assert.ok(Array.isArray(result.icebreakers));
    assert.ok(result.icebreakers.length >= 3);
    const hasCultural = result.icebreakers.some((q) =>
      q.includes('Germany') || q.includes('Japan') || q.includes('snack') || q.includes('student life')
    );
    assert.ok(hasCultural, 'Icebreakers should include contextual cultural references');
  });

  await t.test('3. Dynamic Semantic Compatibility Bonus Calculation', async () => {
    // Both share 'React', both speak 'English', from different countries ('Germany' vs 'Japan'), same grade level
    const bonus = await computeCompatibilityBonus(mockUserA, mockUserB, ['React']);

    // bonus breakdown:
    // +4 (1 shared topic) + 5 (different countries) + 3 (shared language) + 2 (grade level) + 3 (web cluster) = 17
    assert.ok(bonus > 0);
    assert.ok(bonus <= 20, 'Compatibility bonus should not exceed 20 points');
    assert.equal(bonus >= 14, true, 'High synergy pair should receive strong compatibility bonus');
  });

  await t.test('4. Dynamic AI Hook Plug-in to Matching Formula', async () => {
    const topicScore = 50;
    const timeScore = 30;
    const aiBonus = await computeCompatibilityBonus(mockUserA, mockUserB, ['React']);
    const totalCompositeScore = topicScore + timeScore + aiBonus;

    assert.ok(totalCompositeScore >= 80 && totalCompositeScore <= 100);
  });

  await t.test('5. Post-Session Reflection Summarization', async () => {
    const mockReflections = [
      {
        userId: { name: 'Alice', country: 'Germany' },
        learnings: 'Understood microfrontend state isolation in React.',
        culturalExchangeNotes: 'Learned about hackathon culture in Tokyo universities.',
        rating: 5,
      },
      {
        userId: { name: 'Kenji', country: 'Japan' },
        learnings: 'Explored backend caching patterns and server side rendering.',
        culturalExchangeNotes: 'Shared perspectives on university grading in Germany vs Japan.',
        rating: 5,
      },
    ];

    const result = await summarizeReflections({
      session: { topic: 'React Architecture' },
      reflections: mockReflections,
    });

    assert.ok(result);
    assert.ok(result.summary);
    assert.ok(Array.isArray(result.keyTakeaways));
    assert.ok(result.keyTakeaways.length > 0);
    assert.equal(typeof result.collaborationScore, 'number');
    assert.equal(result.collaborationScore, 100);
  });
});
