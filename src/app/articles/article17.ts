import { GameOfLifeComponent } from '../animations/game-of-life.component';

export const article17 = {
  id: 17,
  date: '21.04.2025',
  folder: 'books',
  function: 'books',
  title: 'What is Life',
  subtitle: 'contemplations on Life inspired by the book: complexity science',
  tags: ['complexity'],
  author: 'Mitchell Waldrop',
  published: '1992',
  size: '14KB',
  gameOfLifeComponent: GameOfLifeComponent,
  content: `
<h2>Life is the game of all games</h2>
<p class="article mb-2">I have long been haunted by this question: </p>
<p class="article mb-2"><em>What is a game? </em></p>
<p class="article">My best answer so far was from Jesse Schell's book <a href="/note/15">(link to my note)</a>:</p>
<blockquote>“A game is any problem solving activity approached with a playful attitude.”</blockquote>
<p class="article mb-2">But I wasn't super happy with this definition because it's sort of a tautology. Anyhow, this was just another thing at the back of my mind until suddenly I found an answer in a very unexpected place: <em>Complexity Science</em> by Mitchell Waldrop</p>
<p class="article mb-2">Thanks to this book, I was able to conjure up a much better definition:</p>
<p class="highlight mb-2">A game is adapting to the environment. </p>
<p class="article mb-2">Every species has its own <em>game</em>. They acquire a niche within the bounds of nature and try to stick with it through thick and thin. But we humans are different. We specialized in a very, very handy niche: niche switching. </p>
<p class="article mb-2">In other words, our game <em>is</em> adaptation. Unlike the rest of the world, we are able to accomplish all sorts of extraordinary feats. We can climb a tree, split the atom, and help an old lady walk to the other side of the road. The spectrum of what we can do, just like the universe, is expanding. </p>
<p class="article mb-2">Summa summarum: </p>
<p class="highlight mb-2">every human has their own game</p>
<h3>What the f@ck is Life?</h3>
<p class="article mb-2">A long, long time ago, far, far away in a distant galaxy, the Universe realized that the space of possibilities to compute was just too vast…</p>
<p class="article mb-2">Computation is the process of calculating or solving something using a set of rules (an algorithm). In simple terms, it's how we turn input (like numbers, data, or instructions) into output (like answers, results, or actions) through logical steps.</p>
<p class="article mb-2">The conceivable combinations of things are effectively infinite. For instance, let's pick a humble 1000-gene seaweed. To find the best combination, the Universe would have to examine each and every gene, because each combination is potentially better. Now, if you work out the total number, it's actually not 2 multiplied by 1000. It's 2 multiplied by itself 1000-fold… That's 2-to-the-1000 —</p>
<blockquote>“a number so vast that it makes even the number of moves in chess seem infinitesimal.” </blockquote>
<p class="article mb-2">And we are still talking about a mere seaweed and not a mammal that has roughly 100 times as many genes—and most of those genes come in many more than two varieties. Not to mention if you start comparing things, because we are not in a bubble, and <em>better</em> can only be understood through comparison.</p>
<p class="article mb-2">This is a computational nightmare. So the Universe has decided to outsource computation to Life. But the Universe didn't want to give away all control. After all, what is creativity without constraints? So the Universe, in its graceness, has created rules—limits to what is and what can be. It created a canvas and then handed over the brush to Life.</p>
<h3>A brief history of Life</h3>
<p class="article mb-2">And so, quarks emerged about 10⁻¹² seconds after the Big Bang—from God knows where—and <em>physics</em> was born.</p>
<p class="article mb-2">A microsecond later, those quarks formed atoms.</p>
<p class="article mb-2">A lot later (around 100,000 years), the universe had cooled sufficiently for the first molecule to form from neutral atoms. <em>Chemistry</em> was born.</p>
<blockquote>The first molecule was actually helium hydride (HeH⁺), created when neutral helium atoms combined with protons or hydrogen nuclei. </blockquote>
<p class="article mb-2">Later, helium hydride reacted with atomic hydrogen to form molecular hydrogen (H₂), which became the most abundant molecule in the universe, which then became the primary fuel for star formation (but that only happened at the <em>Cosmic Dawn</em>, roughly 100 million years later…).</p>
<p class="article mb-2">Our beloved mud ball, the Earth, formed a LOT later around 4.5 billion years ago (roughly 10 billion years after the Big Bang).</p>
<p class="article mb-2">Another billion years (give or take a couple hundred million), and <em>prokaryotes</em>, the first forms of cellular life, emerged on Earth. And so <em>biology</em> was born…</p>
<p class="article mb-2">Around 1.5 billion years ago, those prokaryotes merged and formed a cooperative relationship, leading to the evolution of <em>eukaryotic</em> cells.</p>
<p class="article mb-2">Things started to really escalate here, and biology was becoming more and more complicated.</p>
<p class="article mb-2">Which leads us to the start of our species, arguably something like 300,000 years ago in South Africa, where one monkey stood on two legs. Thus, <em>humans</em> were born.</p>
<p class="article mb-2">We then, ingenious apes, invented some mind-blowing stuff like language, writing, and religion, and in turn formed more and more complex tribes. <em>Culture</em> was born.</p>
<p class="article mb-2">Fast forward to 4000 BCE, and the first known civilization rises and falls, and from their ashes, more and more complex societies emerged…</p>
<h3>Hey! Isn't this just… evolution? </h3>
<p class="article mb-2">Well… yes, and no. Life is indeed forming more and more complex layers, BUT strictly speaking, what we call <em>evolution</em> is only the biological layer.</p>
<blockquote>Evolution is defined as the change in the heritable characteristics of biological populations over successive generations.</blockquote>
<p class="article mb-2">The truth is that Life has never stopped evolving on ALL layers.
Atoms are still forming more and more elaborate structures.
Simple molecules are still mingling to find ever more combinations that fit.
And your brain is still trying to come up with new stuff in this very moment…</p>
<p class="article mb-2"><em>Okay, I get it now. Physics, chemistry, biology, humans, culture, and societies are still evolving, right?</em></p>
<p class="article mb-2">Exactly! But the evolution of Life, just like the Universe, is <em>non-linear</em>.</p>
<blockquote>The output is not proportional to the input.</blockquote>
<h3>The life of a token</h3>
<p class="article mb-2">To capture the essence of Life, we will now follow the life of a token.
I want you to imagine a small bit. Actually, not just a bit, but bits of ones and zeros. Like 0111000 or 1100110. Now, for the sake of simplicity, let's say that we have 100 of these running around. But they by themselves are useless. We need something more to bring them to life. We need a hypothesis. Now, if we have some tokens and if we can summon hypotheses, then we have the smallest bit of Life. We have an <em>Agent</em>.</p>
<p class="article mb-2"><em>And that's good - said the Universe. </em></p>
<p class="article mb-2">But just like us, Agents by themselves are meaningless. We need an environment that they can exist in. We need Mother Nature (which is basically everything except the Agent). And now we have established all the important roles on the stage of Life, and now they can start acting.</p>
<p class="article mb-2">Nature, the environment, tends to go first, and with that, a situation arises. And every time a situation arises, an Agent can bid some of its tokens and an associated strength (hypothesis) to compete with or against Nature. Let's say the Agent summons 0110011 with the strength 0.12. Now let's say that this Agent is lucky and this was a good combo. Now the Agent will gain some strength. 0110011 was a good token in this situation, and the associated strength might rise up to 0.23.</p>
<p class="article mb-2"><em>This is good! - said the Agent. </em></p>
<p class="article mb-2">But Nature does not sleep. It posts another challenge—a pattern, a situation, a problem—and the Agent bids 0110011 again with the hypothesis 0.23. And it wins again! Wow! Such token. Much value. Now, to bless this good fortune, Nature has chosen this special token and another lucky one, let's say 1001100, to give birth to a new token. Mhmmm. And their baby will share some of their distinctive nature but will also be somewhat different. Let's say we cut each token in half: 0110 and 1100, and put the two together. The baby now will almost be identical to half of the parents, but since the length was not even, this baby will gain one digit extra length. Same but different. Now this fresh token will have a chance to show who is daddy. But unfortunately, this poor token loses a couple of matches and sadly flushes away.</p>
<p class="article mb-2"><em>Nature can be a bitch. </em></p>
<p class="article mb-2">Of course, this Agent is not limited to bid only one token. Life, and thus Nature, is getting more complex by the hour. So the Agent can bid more to up her game. And to spice things up, more Agents appear on the stage of Life, and they also start bidding their tokens. At first, the distribution of Life is random—some Agents flush away, others barely scrape by. But as the Agents interact with Nature, they paint more and more elaborate structures. Some combos turn out to be pretty good ones. An Agent terminates many more Agents by this hack. Another Agent comes up with a cooperation of a lesser-known Agent that turns out to be quite advantageous. New and new tokens emerge, and with them, more and more sophisticated hypotheses are being summoned. Nature blesses with strength the fittest, and the more they accumulate, the more layers of Life it is.</p>
<p class="article mb-2"><em>This is silly. How could this apply to anything in real life?</em></p>
<p class="article mb-2">Frankly, I am not sure if this informational layer is actually part of Life (although many scientists would argue that it is). I just brought it up because, in an abstract sense, we see Life at the smallest bits. Now that we have the theoretical basis of Life (and how LLMs work), we can zoom in and out of the natural layers of Life to see how it is coevolving.</p>
<h3>Life is coevolving</h3>
<p class="article mb-2">Let's zoom in now, deep into the chemical layer, and watch a simple reaction: the formation of water.</p>
<p class="article mb-2">Nature, our environment, sets the stage: two hydrogen atoms (let's call them 0101 and 0110) and one oxygen atom (1001) drift close together. Since bottom-up hypotheses are an emergent phenomenon from the biological realm, they have to stick with good old-fashioned top-down hypotheses: rules. Like this chemical rule: if two hydrogens and one oxygen are nearby, and enough energy is present, they can bond to form H₂O. The atoms “bid” their potential—and if the conditions are right, the hypothesis is successful: a water molecule forms. The new molecule is more stable, so Nature “rewards” it—energy is released, and the molecule is more likely to persist. But Nature is never done. The environment changes: maybe a burst of UV light hits, or a nearby molecule collides. The water molecule might break apart, losing its “strength.” Or it might encounter other molecules and join a bigger structure—ice, or a complex organic compound.</p>
<p class="article mb-2">Now let's zoom out, to the cultural layer, and have a look at how language evolved. The first ingenious monkey invented the word: “danger.” Of course, it didn't sound this sophisticated. It was more like a big monkey shout. But this brute tone turned out to be pretty effective. It had the effect of signaling to fellow monkeys that danger was near, but it also could surprise or even scare the attacker. It also had an emergent property. Because this innovation turned out to be pretty effective, it spread among the monkey population (and a few generations down the road, we still unconsciously shout in danger).</p>
<p class="article mb-2"><em>That's all fair and square, but I am still not sure—how do these layers connect?</em></p>
<h3>Inter-layer feedback</h3>
<p class="article mb-2">Well, that's a great question! The secret to how these layers interact is <em>emergence</em> and <em>feedback</em>. What happens at one layer can give rise to new patterns, rules, and agents at the next.</p>
<p class="article mb-2">Take our water molecule. Alone, it's just a stable structure. But when millions of water molecules come together, they create new properties—liquidity, surface tension, the ability to dissolve other substances. These emergent properties make what we call <em>life</em> (biology) possible: water forms the medium where the first cells could assemble, where DNA and proteins could fold and interact.</p>
<p class="article mb-2">Now, fast-forward to our clever monkeys. Their biology—vocal cords and brain—makes it possible for them to invent and share signals. The first “danger” shout is a biological event, but it becomes a cultural one the moment it's understood by another. The word is a token, the shout is a bid, and the hypothesis is: <em>“If I make this sound, others will react in a way that helps us survive.”</em></p>
<p class="article mb-2">As the signal proves effective, it spreads. Not through genes, but through memes (culture).</p>
<blockquote>Memes—units of cultural transmission—evolving alongside genes. Today, I guess this cultural (and informational) layer(s) where Life evolves the fastest.</blockquote>
<p class="article mb-2">But the flow isn't one-way. Information on the cultural layer can reach down and change biology and chemistry. For instance, when we humans learned to cook food, we changed the chemical structure of what we ate and made the food more dense, ultimately altering our own biology—we needed less space for our stomachs so that our brains could evolve bigger.</p>
<blockquote>The most shocking study I have found on the topic of interaction between layers is this very famous one showing that beliefs—self-perceptions about aging—can significantly affect the length of a person's life. To vastly simplify: if you believe that stress is bad, you will live much shorter. <em>(Levy et al., 2002)</em></blockquote>
<p class="article mb-2">And now, with the advent of large language models, we're building new agents—artificial ones—whose tokens are words and whose environment is the vast sea of human knowledge. These agents also learn, and adapt, and even generate (hallucinate) new ideas, feeding the output back into the socio-cultural and informational layer, fueling the evolution of our species.</p>
<p class="article mb-2">The key thing boils down to <em>connection</em>. The power in the system is mostly relational, not individualistic. It's this dance between <em>emergence</em> and <em>feedback</em>. Sometimes, a tiny change at the bottom—a mutation in DNA, a new chemical reaction—ripples upward, changing the course of evolution. Other times, a breakthrough at the top—a new word, a new technology—reaches down and reshapes the very fabric of life.</p>
<p class="article mb-2">In this way, <strong>Life is not just a thing, but a process</strong>: a never-ending search for fit structures, a conversation between layers, a mingling of tokens in the grand canvas of Nature.</p>
<p class="article mb-2"><em>So... What should I do with this?</em></p>
<h3>Life is a game</h3>
<p class="article mb-2">Well, first and foremost, this paints a bright picture for Agents. Realizing that we are all part of the same grand canvas can give us a sense of deep purpose. Our actions matter—not just for us, but for the whole Universe. Every change we make can ripple outward, influencing other Agents and shaping the layers of Nature, perhaps in very unexpected ways.</p>
<p class="article mb-2">But apart from meaning, we as Humans are in some sense very special. The secret hack that only we can do is that we <em>consciously</em> change our game. Every single Agent of Life is playing a game, but most of them follow the rules unconsciously and obediently. We are the only ones who can not just follow rules, but also <em>make</em> or <em>break</em> them.</p>
<blockquote>“This is a sparring program, similar to the programmed reality of the Matrix. It has the same basic rules—rules like gravity. What you must learn is that these rules are no different than the rules of a computer system. Some of them can be bent. Others can be broken. Understand?” - Morpheus</blockquote>
<p class="article mb-2">Though we can't bend physics (yet), we do have increasingly more influence over the socio-biological-cultural-informational layers.</p>
<p class="article mb-2">So here is your quest:</p>
<p class="highlight mb-2">Find your game</p>
<p class="article mb-2">I encourage you to find your specific game—one that could only be unlocked by your specific genes, personality, values, skills, and life experiences. The hole in the Universe that only <em>you</em> can fill. I encourage you to experiment boldly, to be surprised by emergence, and to learn voraciously to be the master of your experience.</p>
<p class="article mb-2">It's your move. </p>
<p class="article mb-2"><strong>The game is on.</strong></p>
  `,
};
