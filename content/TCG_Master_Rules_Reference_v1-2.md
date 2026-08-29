# The Crazy Game — Master Rules Reference (v2)

**Purpose:** This is the single source of truth for The Crazy Game's rules — corrected, consolidated, and gap-filled. It supersedes the printed Rules card and Edge Cases card wherever they conflict with this document. This is the intended source document for the QR-code rules AI agent (usable directly as system prompt context) and for final rulebook printing.

**Companion document:** This reference has a companion, `TCG_Board_Layout_Reference_v2.md`, containing the complete space-by-space board layout — every space's exact content, both Portal pairs' locations, all 3 escape boxes, and a full origin/destination directory for all 4 Smileys and 5 Frownies. The two are meant to be used together and both loaded into the AI agent's context: this document covers *how the rules work*, the companion covers *where things physically are*. Sections below point to the companion document wherever it has genuinely useful supplementary detail — those pointers are not exhaustive, so if a question is about a specific space's exact position or contents, check the companion document even where no explicit pointer exists here.

**AI agent guidance — response format:** Several sections below include markdown tables (Crazy Beach exit routes, the Tournament Bonus Roll chart, etc.) because a table is the clearest way to document the data *in this reference*. That doesn't mean the agent should reproduce a raw table in a live chat answer — most players find a table harder to parse mid-game than a plain-language answer. Default to prose: describe outcomes conversationally, and if a player's question implies a specific roll or situation, answer for that specific case rather than listing every possibility. Only fall back toward a more structured list if a player explicitly asks to see all the options at once.

---

## Changelog from Original Printed Materials

1. **Swap (board space) and Swap Crazy Coin** now transfer a Life Preserver from the player being swapped with, if they have one. (The printed Edge Cases card said the opposite — "Life Preservers never transfer in a swap" — this was an error and is corrected throughout.)
2. **"Second sailboat" removed from the board.** Every reference to it (Take and Double, Bonus Golden Life Preserver, Surge interaction) now reads **"Sharky Shores."** Sharky Shores begins one space before the former sailboat location — the balance and playtesting already validated at that boundary carries over unchanged.
3. **Portal rule formally documented for the first time.** Previously the checkered↔checkered and spiral↔spiral spaces existed only as an icon in the board key with no written rule.
4. **Whirlpool count confirmed at 3,** all located within Sharky Shores. The board previously had a 4th whirlpool earlier in the path; that space is now the Fish Pond.
5. **Escape box ("X OR Y") mechanic confirmed and fully documented** (Section 3) — previously icon-only with no written rule, confirmed to be a real point of tester confusion.
6. **Forks & Route Choice formally documented for the first time** (Section 4) — three player-chosen path splits (Mud Pond Loop, Crazy Beach Loop, Crazy River shortcut) existed on the board with zero written rule anywhere. This was a first-order gap in Basic Gameplay, not an edge case — nothing previously told a player they could choose a route at all.
7. **The Bridge formally documented for the first time** (Section 6) — clarifies it's a plain, non-connecting path space, not a fork or shortcut, resolving a natural point of newbie confusion about whether it links two parts of the board.
8. **Crazy Beach's entry-only nature formally documented** (Section 5) — it was never reachable via ordinary path movement to begin with; only sinking or a Tournament Mode start condition lead there. Exit route space compositions confirmed for both routes, including Portal identity (Checkered, distinct from Crazy River's Spiral Portal) and confirmation that Smiley/Frowny distances vary board-wide with no fixed formula. Also newly documented: a player re-emerging at Crazy Beach must wait until their next turn to roll and exit — no immediate follow-up roll.
9. **Forward-only movement formally stated as a core rule** (Section 3) — players can never elect to move backward to reach a specific space; the only backward movement is the forced bump retreat.
10. **Bumps section corrected and expanded** (Section 9): (a) the crossroads-retreat rule — retrace the exact path just traveled, never a new choice — was promoted from a buried Edge Case entry into the core Bumps rule, fixing a stale cross-reference in Section 4 that pointed to Section 9 before the rule actually lived there; (b) the "retreat past space 1 stops at Start" rule was confirmed in conversation but never actually written into this document until now — a genuine miss worth flagging honestly rather than assuming it was already captured.
11. **General retreat-direction principle added** (Section 9): bump retreat always follows the path's fixed printed direction from the player's current space, never reversing however they arrived (Crazy Beach exit, Smiley/Frowny, Portal, Swap, or a prior bump). Applied explicitly to the Crazy River reconvergence point and to Risky Rapids' two-way corridor (Section 13).
12. **Bump sequencing rule confirmed and documented** (Section 9) — resolves the previously open question about Life Preserver loss and water. Life Preserver handover always happens first, while the bumped player is still on their original space; if that leaves them at zero Life Preservers while still in water, they sink immediately and the 2-space retreat never happens. This is the correct order specifically because the wrong order (retreat first, lose the Life Preserver after) would produce the wrong outcome for a player barely inside Crazy River or on the first whirlpool.
13. **Risky Rapids junction retreat direction corrected** (Sections 9 and 13) — an earlier version of this document incorrectly treated the Risky Rapids junction as exempt from the crossroads rule due to its dead-end-spur structure. Corrected: the same history-based principle applies regardless of structure — retreat direction depends on the player's own most recent movement, not on whether the junction is a true parallel-branch fork or a spur. Also broadened Section 9's crossroads rule, which previously only cross-referenced Section 4's three forks and didn't actually cover this case. Further resolved: a bump's forced direction (always toward the shore) never overrides a player's own established travel direction — a player who already reached the shore and is exiting stays an exiting player even after a bump repositions them, and does not get a second shot at the shore without fully exiting and making a fresh, deliberate re-entry.
14. **Risky Rapids confirmed as water** for Life Preserver purposes (Section 13) — losing a last Life Preserver to a bump inside Risky Rapids triggers the same immediate-sink sequencing as Crazy River and the whirlpools.
15. **Shore-space retreat model corrected** (Section 13) — an earlier version of this document incorrectly assumed the shore space caps a bump retreat the same way Start does. Corrected: Start's capping is due to genuine physical nonexistence beyond it (a true board edge), while the shore is merely the functional endpoint of a bidirectional corridor with real space on both sides — not a comparable structural boundary. A retreat that would cross the shore now passes through it and continues its full distance back toward Crazy River, with worked examples added for each relevant distance.
16. **AI agent interaction guidance added** (Section 9) for ambiguous fork/junction retreat questions — when a player describes their position without revealing how they got there, the agent must ask a clarifying question, but the question needs to actively correct a likely misconception (that retreat direction depends on the bumping player's path, not the bumped player's own) rather than just requesting more detail.
17. **Sharky Shores formally documented as its own section** (Section 7) — two named Frownies with confirmed distances, and an explicit clarification that Life Preservers do not protect against Frowny relocation, since that was a natural but incorrect assumption worth heading off directly.
18. **New "Side Notes" section added** (Section 18) for resolved scenarios that don't fit the Consolidated Edge Cases format — covering a Risky Rapids (−1)-space sink-and-reclaim sequence, stacking two Life Preserver sources from a single bump, and confirming that a Life Preserver arriving at Crazy Beach goes only to the next player who actually re-enters by sinking, not to a player merely present there.
19. **Unobstructed movement confirmed** (Section 3) — other players occupying spaces along a roll's path never block or affect movement; only the final landing space matters.
20. **Crazy Coin lifecycle fully classified** (Section 14) — coins aren't simply "used up and reshuffled" as the original text implied. Corrected: Swap is only held *until* the player actually executes it — once used, it moves to the discard pile like Surge, Take and Double, and Bonus Golden Life Preserver, rather than remaining permanently held the way Double Fours & Fives and Easy Win do. Also added brief strategic notes on Double Fours & Fives and Swap for richer player-facing answers.
21. **No-traversal-history exception added to the crossroads rule** (Section 9) — when a player arrives exactly at a fork's merge point via a Swap, Portal, or Smiley/Frowny (none of which involve walking a branch), there's no path history to retrace. The crossroads rule's override doesn't apply in that case, so the fork's normal default reasserts: the player freely chooses which branch to retreat into. Confirmed live example: the Crazy Beach Loop's merge-point Portal produces this exact scenario when a player arrives via its twin (teleporting in), even though landing on the merge-point Portal directly does not.
22. **Crazy Beach Loop's branch prefix fully documented** (Section 5) — the last remaining open item in this document. The exact content of both routes from the original fork junction through to Crazy Beach's own entry point is now confirmed, and connects seamlessly with the already-documented Crazy Beach exit table (the final prefix space on each route is the same physical space as that table's "roll 1," not a separate space). No open items remain anywhere in this document as of this entry.
23. **Full board layout confirmed via a companion document** (TCG_Board_Layout_Reference_v2.md) — a complete space-by-space description of the entire board. Cross-validated against every previously-established fact in this document (both Crazy Beach Loop branches, the Spiral Portal's exact position, the Risky Rapids (−1) space position, both Bridge locations) with zero contradictions found. One correction resulted: the previously anonymous Smiley/Frowny examples in Section 7 are now identified by number (Smiley 1, Smiley 4, Frowny 4, Frowny 5), with a full origin/destination directory for all 4 Smileys and 5 Frownies available in the companion document. Note: an initial miscount briefly had Crazy River at 2 Life Preserver spaces before being corrected back to 1 — the second one sits at the dry convergence point, not within the water hazard itself. Also confirmed: the visual difference in how (−1) spaces are drawn in Sharky Shores versus Risky Rapids is purely an art choice, not a rules difference — the mechanic is identical everywhere.
24. **Cross-reference pass between this document and the companion Board Layout Reference** — added a prominent note explaining the two-document relationship at the top of this file, plus explicit pointers in the Mud Pond Loop (Section 4), Bridge (Section 6), Sharky Shores (Section 7), and Risky Rapids (Section 13) sections, since those are where the companion document now has real supplementary detail that wasn't otherwise flagged. Before this pass, only one such pointer existed in the entire document.
25. **FAQ cross-check (Section 3, 14, 15):** three items confirmed via a parallel FAQ-drafting effort. Explicit clarification added that overshooting the Castle means no movement that turn, not a bounce-back. Coin lifecycle language refined to distinguish Swap's active, turn-consuming use from Double Fours & Fives' and Easy Win's passive, standing-ability nature — the original phrasing risked implying all three "wait for a turn to use," which is only true of Swap. Confirmed and added: Crazy Coins reset every game in tournament play; only Sand Dollars persist across games.
26. **Corrected a real misunderstanding about Portals at fork reconvergence points** (Sections 5, 11, and the companion Board Layout Reference) — this document had implicitly treated the Crazy Beach Loop's Portal as a mandatory checkpoint every player passes through upon finishing either branch. That's wrong: a Portal is an ordinary space like any other, and only triggers if a roll lands a player exactly on it. Most rolls overshoot it and simply continue along the already-merged path beyond it without ever teleporting. Added an explicit general principle to Section 11 so this same wrong assumption isn't repeated at the other three Portal locations.
27. **Two wording fixes surfaced by testing the live AI agent:** Section 11's Portal rule read as if "landing" itself were mandatory, rather than the teleport that follows landing — corrected to remove that ambiguity. Section 3's forward-only movement rule read as if it applied to all backward movement in the game, when it's actually specific to ordinary walking along the path — transport mechanisms (Frownies, sinking to Crazy Beach, Swap) can genuinely relocate a player backward and were never restricted by this rule, since they involve no directional choice. Both are now explicit rather than implied.
28. **Version bumped to v2**, marking the transition from initial development/stress-testing into live testing — the AI agent is now deployed and being used by real players. All 27 prior fixes above remain intact; this bump exists purely to make the current version unambiguous when starting a new conversation thread for ongoing live-testing corrections. The companion Board Layout Reference is bumped to v2 alongside it to keep the pair aligned, though its content is unchanged since v1.
29. **General turn-order principle added** (Section 3) — a genuine first-order gap caught via a live AI agent transcript. The document previously stated only the isolated fact that a bump-to-star scenario passes the next turn to the player after the bumped player (Section 17), but never stated the actual governing rule: turn order always follows whoever most recently took a turn, regardless of *why* they took it. Without that general principle written down, the live agent affirmed an incorrect causal model when a tester asked whether the turn-skip was "because they were bumped" — an answer that happens to be right for bump-to-star but would be wrong for a bump landing on a plain space (there, the bumping player is still the last one to have taken a turn, and play resumes after *them*, not the bumped player). Section 3 now states the general principle, with AI agent guidance on correcting mis-framed causation rather than just confirming a coincidentally-right outcome. Section 17's edge case entry now derives from the principle instead of standing alone, and a contrasting non-star bump case was added alongside it. Also fixed: the closing line of this document still read "v1" after the version bump in item 28 — corrected to v2.
30. **Crazy Beach exit route corrected from roll-determined to freely-chosen** (Section 5) — caught via a live AI agent transcript. The agent told a player "you don't choose Upper vs. Lower separately — your roll number determines which route's result you get," which contradicts the general fork rule (Section 4: players freely choose their route at all three forks, this one included). The exit table was written to show outcomes per branch per roll, but nothing explicitly said the branch choice itself remains the player's — an easy misread, especially since the roll happens first and naturally reads as "driving" the outcome. Section 5 now explicitly restates that this is the same freely-chosen *mechanic* as Section 4, with a concrete example (deliberately picking the worse immediate result for better positioning later) and AI agent guidance against the "roll determines route" framing. **Follow-up precision fix, same session:** the first pass of this correction loosely called it "the same fork mechanic as Section 4," which risked conflating Crazy Beach's own exit point with the original CB Loop fork junction — two genuinely different physical locations on the board (confirmed against the companion Board Layout Reference's "Upper/Lower Crazy Beach entry point" labels). Reworded to make explicit that only the *mechanic* is shared (roll first, then freely choose, never the reverse); the original fork junction and Crazy Beach's exit arrows are separate decision points that happen to feed the same two downstream branches at different points along them. Also added: a general AI agent guidance note (top of document) against reproducing raw markdown tables in live chat answers — tables in this document exist for reference clarity, not as a template for player-facing responses; the agent should default to prose and answer for the player's specific situation.

---

## 1. Overview & Win Condition

The Crazy Game is a race around the board. Players roll and move clockwise, collecting and losing Life Preservers along the way. **The first player to land exactly on the Castle wins** (unless holding an Easy Win Crazy Coin — see Section 14).

Life Preservers are required to survive water hazards: Crazy River, Risky Rapids, the whirlpools, and the Fish Pond. Losing your last one in the water sends you back to re-enter at Crazy Beach.

## 2. Setup

- Each player chooses a pawn and matching color die.
- All pawns start on the Start space.
- Place Life Preservers on Crazy Beach — one per player, plus one extra (3 players = 4 Life Preservers, 4 players = 5, etc.). **Exception:** 2-player games use only 2 Life Preservers total.
- Shuffle Crazy Coins and place face-down on the Crazy Coin Stack.
- Roll to see who goes first — highest roll goes first. Turns proceed clockwise from there.

## 3. Basic Gameplay

- Roll and move forward that many spaces.
- **Exact roll required to win** — you must land exactly on the Castle. **If your roll would overshoot it, you simply don't move that turn at all** — no partial move toward it, no bounce-back off it. Wait for a future turn that rolls the exact remaining distance.
- **Land on mud** → Lose a turn. Place your die in the large central mud pond on the board (this is the physical "mud puddle" the rule refers to — distinct from the individual mud-splat spaces along the path). Next turn, instead of rolling, simply retrieve your die from the pond — that's your whole turn. **Why (for AI agent use — not on the printed card):** with several players at the table, it can genuinely be hard to remember by the time your turn rolls back around whether you already sat one out or not. A die sitting in the mud settles it at a glance — no arguing, no relying on memory. The printed rulebook intentionally keeps this simpler ("keeps lost turns visible to all players") since players naturally discover the *why* through play — but if a player directly asks why, give the fuller reasoning above. If a player gets bumped off a mud space before retrieving their die, see Section 17 — the obligation clears immediately, not carried forward.
- **Land on a star** → Roll again immediately (an extra turn).
- **Land on an escape box ("X OR Y")** → You're stuck. On each turn, roll normally — you escape only by rolling one of the two numbers shown. Move that many spaces and continue play normally. Roll any other number and you remain stuck until your next turn. **This is a fully separate mechanic from mud** — escape boxes have no connection to the central mud puddle. You don't place your die anywhere; you simply stay in place until you roll one of the listed numbers.
- **Movement is always forward, never backward by choice — but this applies specifically to ordinary walking along the path.** A player can never elect to walk backward step-by-step to reach a specific space — chasing a star, another player's Life Preserver, or anything else — even if one is sitting just behind them. The only backward *walking* in the game is the forced 2-space bump retreat (Section 9) — never something a player chooses to do. This is a separate category from **transport mechanisms** (Frownies, sinking to Crazy Beach, Swap): those relocate a player instantly to a fixed destination, which can genuinely be earlier in the game — several Frownies exist specifically for this (Section 7, Section 8's directory). That's not "backward walking," and it isn't restricted by this rule at all, since there's no directional choice involved — the destination is simply wherever the mechanism sends you, forward or back.
- **Movement is unobstructed by other players.** Rolling and moving simply counts spaces to your final landing space — other players occupying spaces along the way don't block, slow, or otherwise affect your movement. Only your final landing space matters (triggering a bump if it's occupied, or whatever action that space has).
- **Turn order always follows whoever just took the last turn — never anything else.** After any roll and its full action resolve, play passes to the next player clockwise from whoever *just rolled*, full stop. This sounds obvious, but it's worth stating explicitly because bonus rolls (stars) can make it non-obvious in practice: a star's extra roll is taken by whoever landed on the star, so the *next* turn goes to whoever follows *that* player — regardless of how they got onto the star (walked there normally, arrived via a bump retreat, a Smiley/Frowny, a Swap, anything). The cause is always "they were the last one to take a turn," never "they were bumped," "they were sent by a Frowny," etc. Those mechanisms only matter insofar as they determine *where a player ends up* — turn order itself only cares about who rolled last. **AI agent guidance:** When explaining any turn-order question involving a bump, Frowny, Swap, or Portal that happens to land someone on a star, always frame the causation as "because they just took a turn" — never as "because they were bumped" or "because of the [mechanism]." If a player asks a yes/no question that bakes in the wrong causation (e.g., "so it's because they were bumped, right?"), don't just confirm — correct the framing even while agreeing the immediate outcome is right, since the wrong framing will misfire on the very next non-star bump.

## 4. Forks & Route Choice

At three points on the board, the path splits into two distinct routes. Players freely choose which route to take — nothing forces one over the other.

**Timing:** You don't need to land exactly on the fork space to choose. If your roll carries you past the fork point, pick a direction and use the remaining spaces of that same roll on it — e.g., rolling a 5 with the fork 3 spaces away means you choose a route and move 2 more spaces down it.

**The two "loop" forks** (each reconverges into a single shared path afterward):
- **Mud Pond Loop** — the path splits around the central mud pond and reconverges afterward. The two routes are unequal in length, balanced by differing star/mud space distribution rather than exact space-count parity. **See the companion Board Layout Reference** for the complete space-by-space content of both branches.
- **Crazy Beach Loop** — same structure. One route carries more Star spaces; the other carries a Smiley (follow-arrow) space instead. Since Stars fall on alternating spaces along both routes, the same roll often lands you on a Star via one route and a plain space via the other — a common deciding factor for players. **See Section 5** for the complete space-by-space breakdown of both routes, from the original junction through to where both branches' numbering ends at a Portal — which, like any other space, only triggers if a player lands on it exactly (Section 11).

**The one "shortcut" fork — Crazy River** (this one doesn't loop back around anything; it's a genuine alternate route that reconverges with the main path afterward, cutting distance rather than adding to it):
- Crazy River is **2 spaces shorter** than the alternate route.
- **Requires a Life Preserver to enter** (see Section 12 for the narrow exact-roll exception for players without one).
- Crazy River contains only positive spaces: 1 Star and 1 Life Preserver space. (A second Life Preserver space sits at the point where Crazy River connects back to the main path — but that convergence point is dry land, not water, per the worked example below, so it's not counted as part of Crazy River's own water hazard.)
- The alternate route is longer and denser with hazards: 2 Mud spaces, 2 Stars, the Fish Pond, and a Spiral Portal (6 spaces into this alternate route) — a different Portal pair from the Checkered one at the Crazy Beach Loop's reconvergence point (Section 5).
- **Crazy River is the only access point to Risky Rapids** — a further optional branch reachable only from inside the river (see Section 13).
- A player with no Life Preserver at this fork must take the alternate route, unless they qualify for the exact-roll exception into the river.

**Why routes aren't equal length:** This is intentional — shorter/safer routes are offset by fewer opportunities (fewer Stars, no Crazy Coin access via Risky Rapids), while longer/riskier routes offer more upside. It's a genuine strategic decision each time, weighed against your current Life Preserver count, nearby opponents, and what you're chasing.

**Relationship to backward movement:** This is a forward-movement choice only. When a player is bumped backward through one of these fork areas, there's no new choice involved — Section 9 already covers this: they retrace the exact path they just came from, not pick a new one.

**AI agent guidance:** When a player asks whether they can choose their route, confirm that the choice is entirely theirs, briefly explain the relevant trade-offs (Star density, hazard density, Life Preserver requirement for Crazy River, etc.), and then leave the decision to them. Don't ask which fork they're currently standing at — a static QR code has no way to track game state, so treat this as strategic context to offer, not a question that needs the player's exact position to answer.

## 5. Crazy Beach — Sinking, Exit Routes & Re-Entry

**Crazy Beach is entry-only.** It is not a space on the main path and cannot be reached by rolling, bumping, swapping, or any other form of ordinary movement. The only ways to arrive there are:
- Sinking in water with no Life Preserver (Section 12), or
- Certain Tournament Mode start conditions (Section 16).

Because Crazy Beach was never a countable space on the main path, several natural-sounding questions all resolve to "no": a player cannot roll onto Crazy Beach to land on another player and take their Life Preserver, and cannot roll onto Crazy Beach specifically to pick up a Life Preserver sitting there. Both require reaching it by ordinary path movement, which never happens. Crazy Beach's arrows only point outward, toward its two exits — there is no arrow, and no rule, allowing entry from the main path.

**Exit routes:** The Crazy Beach Loop fork (Section 4) has two branches — Upper and Lower — that later reconverge. Crazy Beach connects to both branches via its own two one-way exit arrows, joining further along each branch than the point where the main path's fork junction feeds in. This means a player exiting Crazy Beach travels a shorter version of the branch than a player who chose that same branch from the original fork.

**The route is still freely chosen — the table below does not decide it for the player.** To be precise about *which* decision point this is: this is **not** the original CB Loop fork junction from Section 4 (that's a different physical location on the main path, reached only by ordinary rolling — a player exiting Crazy Beach never passes through it). This is a **second, separate decision point that exists only for players sinking and re-emerging at Crazy Beach**, formed by Crazy Beach's own two one-way exit arrows, which feed onto the same Upper/Lower branches but further along than where the original junction joins them. What it shares with Section 4's forks is only the *mechanic*, not the location: the player rolls first, then picks Upper or Lower, applying the full roll to whichever branch they choose — the roll never picks the branch for them. The table exists to show what a given roll produces *on each branch*, precisely so a player can compare both outcomes before choosing. A player who'd rather have a shot at a Life Preserver two turns from now, for instance, can deliberately pick the branch with the worse immediate result on this roll. **AI agent guidance:** Never phrase this as "your roll determines which route you get" or "you don't choose the route separately" — both wrongly imply the choice is automatic. Also don't conflate this decision point with the original CB Loop fork junction (Section 4) if a player's question suggests they might be picturing the same spot — they're physically different points on the board that happen to share the same two downstream branches.

**Timing:** A player who sinks and re-emerges at Crazy Beach does not get to immediately roll and choose an exit route — sinking happens as the resolution of that turn's move, so the player must wait until their next turn to roll, exactly like any other player's turn.

From Crazy Beach's own exit point, the two routes are:

| Roll from Crazy Beach | Upper Route | Lower Route |
|---|---|---|
| 1 | Star | Star |
| 2 | Life Preserver | (blank) |
| 3 | (blank) | Star |
| 4 | Smiley (advances 8 spaces — specific to this Smiley only, see Section 8) | (blank) |
| 5 | (blank) | Life Preserver |
| 6 | (blank) | Checkered Portal *(reconvergence)* |
| 7 | Checkered Portal *(reconvergence)* | — |

Both routes' numbering ends at the same Checkered Portal — but reaching that general area doesn't mean every player passes through it. Like any other space, the Portal only triggers if a roll lands a player *exactly* there (Section 11); most rolls will overshoot it and simply continue along the single, already-merged path beyond it. A player who *does* land exactly on it teleports immediately per the standard Portal rule — that's a different Portal pair from the Spiral Portal on the Crazy River alternate route (Section 4).

**Branch length from the original fork junction:** A player choosing this fork from the original junction (not re-emerging from Crazy Beach) travels the following spaces before reaching the point where Crazy Beach's own exit joins in:

| Space (from junction) | Upper Route | Lower Route |
|---|---|---|
| 1 (the junction itself) | Blank | Blank |
| 2 | Blank | Blank |
| 3 | Blank | Star |
| 4 | Star | Blank |
| 5 | Blank | Star *(= Crazy Beach's own "roll 1" below)* |
| 6 | Star *(= Crazy Beach's own "roll 1" below)* | — |

The final Star on each route is not a separate, additional space — it's the exact same physical space listed as "roll 1" in the Crazy Beach exit table above. From there, a player arriving via the original junction and a player exiting Crazy Beach experience an identical remaining sequence; continue with that table starting at roll 2 for whichever route applies.

## 6. The Bridge (Visual Crossing — No Connection)

The wooden bridge is **not** a fork, shortcut, or connection point of any kind. It's a plain, single-purpose, landable path space on the later stretch of the board (roughly 3/4 of the way through the game). Nothing special happens when you land on it — no icon, no action, no choice.

The board's winding layout means this later stretch visually crosses over an entirely separate, much earlier stretch of the same path (roughly 1/4 of the way through the game). The bridge exists purely to show that crossing on paper — **the two paths are never connected, by any means.** A player cannot cross between them by landing on the bridge or otherwise.

The earlier path running underneath the bridge is likewise a normal, uninterrupted stretch — there is no distinct "space under the bridge" to land on or count separately. Movement through that area is counted exactly like any other stretch of path.

**Where it fits relative to other landmarks:** The "under the bridge" stretch begins immediately after the Mud Pond Loop (Section 4) reconverges. A player who has just come around the mud pond is on this earlier stretch — not anywhere near the actual bridge space itself, which sits on the path roughly 3/4 of the way through the game, above the other path, and cannot be reached from this earlier position by any means. **See the companion Board Layout Reference** for the exact position of both the under-bridge stretch and the actual bridge space.

**AI agent guidance:** Unlike Forks (Section 4), where the agent should give context without asking board position, "the bridge" is a genuinely ambiguous phrase — it could mean the actual bridge space or the earlier stretch beneath it, and the correct answer differs depending on which one a player means. If it isn't already clear from what the player has said, ask which one they're near before answering.

## 7. Sharky Shores — The Final Gauntlet

Sharky Shores is the final stretch of the board — a hazard-dense gauntlet leading straight to the Castle. It contains two Frowny spaces, a cluster of (−1) Life Preserver spaces, and the board's 3 whirlpools (Section 12), with plain "stepping stone" safe spaces interspersed between the hazards. **Nothing here is stacked** — every hazard, safe space, and whirlpool is its own distinct space.

**The two Frownies in Sharky Shores:**
- One sends a player back roughly 10 spaces.
- The other sends a player back to roughly 1/6 of the way through the game — one of the most severe setbacks on the board.

**See the companion Board Layout Reference** for the exact left-to-right sequence of stepping stones, the two Frownies, the (−1) spaces, and the 3 whirlpools.

**Life Preservers do not protect against Frownies.** Worth being direct about this, since it's a natural but incorrect assumption: a Life Preserver's only job is preventing drowning outcomes (whirlpools, the Fish Pond, losing your last one anywhere in water — Section 12). A Frowny is a completely unrelated forced-relocation mechanic; holding a Life Preserver has no bearing on it at all.

**Balance:** Sharky Shores' severity is intentionally offset elsewhere on the board by Smiley spaces and other recovery mechanics that can return a player close to where they were. This is a deliberate design pattern, not an oversight.

## 8. Icon & Space Key

| Icon | Meaning |
|---|---|
| ⭐ Star | Roll again |
| Mud splat | Lose a turn |
| Checkered pair (linked by double arrow) | Portal — immediately transport to matching Portal. Checkered connects to Checkered; works both directions |
| Spiral pair (linked by double arrow) | Portal — immediately transport to matching Portal. Spiral connects to Spiral; works both directions |
| 🙂 Smiley (green dotted arrow) / 🙁 Frowny (blue dotted arrow) | Follow the arrow to the connected space |
| Circular refresh arrow icon | Swap space — MUST swap with any other player |
| "X OR Y" box | Escape box — roll one of the two listed numbers to escape (see Section 3) |
| 🛟 Life preserver icon | Take a Life Preserver |
| 🛟 with (−1) | Lose a Life Preserver |
| Whirlpool → beach umbrella | If you have no Life Preserver: sink, re-enter at Crazy Beach |

**Note:** Checkered portals and spiral portals are two *separate, non-interacting* pairs — checkered never ports to spiral.

**Note:** Smiley and Frowny distances vary considerably and have no universal formula — each one moves a player to its own specific, individually fixed space, per its printed arrow. Confirmed examples: **Smiley 4** (Section 5's Crazy Beach Upper route) moves 8 spaces; **Smiley 1** runs from near the very start of the game to the Crazy River alternate route, roughly 2/3 of the way through; **Frowny 4** (Sharky Shores, 1st of 2) sends a player back roughly 10 spaces; **Frowny 5** (Sharky Shores, 2nd of 2) sends a player back to roughly 1/6 of the way through the game. There are 4 Smileys and 5 Frownies total on the board — see the companion Board Layout Reference document for the complete origin/destination directory of all of them. **Do not assume any undocumented Smiley or Frowny shares another one's distance.**

## 9. Bumps

Landing on a space occupied by another player:

- Bumped player immediately gives the bumper one Life Preserver, **if they have one.**
- Bumped player moves back 2 spaces and must complete the action on that space.
- **Sequencing matters when water is involved:** The Life Preserver handover happens first, while the bumped player is still standing on their original space (a proximity-based handover). If that handover leaves them with zero Life Preservers while they're still standing on a water space, they sink immediately per the standard Water rule (Section 12) and go straight to Crazy Beach — **the 2-space retreat never happens**, since sinking overrides it. This same logic applies whenever a bump *retreat* lands a player on a water hazard with zero Life Preservers, even if the original bump space was dry — Crazy River, the Fish Pond, and the whirlpools all work identically here. This sequencing exists specifically to prevent the wrong outcome: a player barely inside Crazy River, or sitting on the first of the 3 whirlpools, does not get to retreat to "safety" first and lose their Life Preserver after — they lose it first, while still in the water, and sink before any retreat is applied. A player holding 2+ Life Preservers only gives up one, keeps at least one, and is unaffected — they retreat normally, safe even if the retreat lands them in water too.
- The bumper remains on the space and completes its action as usual.
- Bumps can cascade — stars, mud, smileys, frownies all still trigger normally on the retreat.
- **Retreating through a fork or junction:** If a 2-space retreat crosses back through a point where the path is ambiguous — one of the three forks (Section 4) or the Risky Rapids junction space (Section 13) — the bumped player retraces the exact path they just traveled, based on their own most recent movement to reach that space. This isn't limited to true parallel-branch forks; it also applies to spur/dead-end junctions like Risky Rapids' entry point, where the ambiguity is between the spur and the main path rather than between two parallel branches.
- **AI agent guidance — asking the right clarifying question:** When a player describes their position at one of these ambiguous junctions without saying how they got there (e.g., "I'm on the space just past Crazy River"), the agent must ask before answering — but the question needs to redirect to the correct criterion, not just request more detail. Players may naturally, and incorrectly, assume retreat direction depends on which way the *bumping* player came from rather than their own path. Left uncorrected, this could lead a player to retreat themselves somewhere they shouldn't go — including, in a water-adjacent case like this one, an avoidable wrong sink. Ask in a way that names the correct criterion directly, e.g.: "That depends on which way *you* most recently traveled to reach that space — not the direction the player who bumped you came from. Did you come through Crazy River, or the other route?" Giving both possible outcomes in the same response (rather than waiting for their answer to reply again) keeps this to a single exchange.
- **When no traversal history exists:** The crossroads rule above only works because there's a real path just traveled to retrace. If a player instead arrives exactly at a merge point via a Swap, a Portal teleport, or a Smiley/Frowny — none of which involve walking either branch — there's no history to fall back on. The crossroads rule's precondition isn't met, so the fork's normal default reasserts itself: the player chooses which branch to retreat into, exactly as they would approaching the fork under their own power. This doesn't apply to a retreat that itself lands a player at a merge point (e.g., a second consecutive bump) — that retreat trajectory still has an inherent direction along whichever branch was already in use, so the normal history-based rule still applies there. When asking the clarifying question above, listen for a teleport-style answer ("I got swapped there," "a Portal put me there") rather than a directional one — that's the signal to shift to this rule instead.
- **Worked example — the Crazy Beach Loop's merge-point Portal:** A player who lands *directly* on this Portal (via roll, bump, or swap) teleports away immediately and is never actually sitting there in a bumpable state. But a player who lands on its *twin* Portal elsewhere on the board teleports *into* the merge-point Portal as their landing spot — and since arriving as a teleport's destination doesn't trigger a second, reverse teleport, they do remain sitting there afterward. If bumped while sitting there, they arrived via a Portal teleport, not by walking either branch — so per the rule above, they choose which branch to retreat into.
- **Retreat direction is fixed to the printed path, never reversed through arrival method:** Regardless of how a player reached their current space — normal roll movement, a Crazy Beach exit, a Smiley/Frowny transport, a Portal teleport, or a Swap — a bump retreat always moves 2 spaces along the path's fixed printed-forward direction from wherever the player currently sits. It never attempts to reverse the method of arrival (e.g., a player bumped after a Smiley transport does not retreat back through the Smiley; a player bumped after exiting Crazy Beach does not retreat into Crazy Beach, since Crazy Beach cannot be re-entered by any means — Section 5). This holds through consecutive bumps too: a retreating player who is immediately bumped again retreats 2 more spaces in the same fixed direction — never forward, even though forward might technically be "the way they just came from" on that second bump.
- **Worked example — Crazy River reconvergence:** A player who traveled through Crazy River and is bumped right where Crazy River rejoins the alternate route retreats back into Crazy River — not onto the alternate route, even if the bumper arrived from there. The bump itself happens on dry land (the reconvergence point isn't water), so the sequencing rule above doesn't trigger a sink there. But if the player only had one Life Preserver and gave it up to the bumper, they're now retreating into a water space (Crazy River) with zero Life Preservers — which does trigger the standard Water rule: they sink and re-enter at Crazy Beach instead of completing the retreat.
- **Exception:** Crazy Beach is the only space where multiple players can coexist — landing there on top of another player never triggers a bump (see Section 5 for how players arrive there).
- **Exception:** A retreat that would go past space 1 (the first space on the track) simply stops at Start — there's no space "before" it.

## 10. Swaps (Board Space)

Landing on the Swap icon:

- **Mandatory** — you must swap with any other player, even at a disadvantage.
- **If the player you're swapping with has a Life Preserver, you take it from them** (Life Preserver transfers to the swapper).
- You take their exact board position; they take yours.
- You must complete the action on the space you swapped to.

## 11. Portals (Checkered ↔ Checkered, Spiral ↔ Spiral)

Two independent, same-type-only portal pairs exist on the board. If you land on either, the teleport to its twin is mandatory — you don't get a choice to decline it. Both portal spaces are single-purpose (no star, mud, or other icon underneath) — the teleport is the entire action.

**Portals are ordinary spaces, not automatic checkpoints.** Like a star, a mud space, or any other icon space, a Portal only triggers if a roll (or a bump retreat, swap, etc.) lands a player *exactly* on it. A player whose roll would carry them past a Portal simply continues straight through to wherever that roll actually lands them — the teleport never happens, and the Portal is no different from any other space they moved through along the way. This matters most where a Portal sits at a fork's reconvergence point (e.g., the Crazy Beach Loop, Section 5): reaching that general area of the board does *not* mean a player is forced through the Portal. Most rolls will overshoot the exact Portal space and simply continue along the single, already-merged path beyond it, same numbering as any other player who happens to land there.

**Full sequence:**

1. You land on a portal space (checkered or spiral). If it's occupied, standard bump applies: the occupant gives you their Life Preserver (if any) and moves back 2 spaces, resolving any cascade normally.
2. You remain on that portal space and complete its action: mandatory teleport to its twin (same type only — checkered to checkered, spiral to spiral).
3. If the twin portal space is also occupied, the same bump applies there: that occupant gives you their Life Preserver (if any) and moves back 2 spaces.
4. Your turn ends on the twin portal space. Nothing further to resolve.

## 12. Life Preservers & Water

**Core rule:** You must have at least one Life Preserver to survive in the water.

**Entering Crazy River:** Requires a Life Preserver. Only exception — a player with none may enter with an *exact* roll that lands them directly on another player inside (stealing their preserver) or directly on the Life Preserver space inside. Either way they survive safely.

**Sinking (re-enter at Crazy Beach) happens when:**
- Landing on one of the 3 whirlpools without a Life Preserver
- Landing on the Fish Pond without a Life Preserver
- Losing your last Life Preserver anywhere in water

**Re-entering at Crazy Beach:** If a Life Preserver is there, you get one (just one). See Section 5 for exit routes back onto the main path.

**Getting & losing preservers:**
- Earn one by bumping a player who has one, or by landing on a Life Preserver space.
- Lose one by getting bumped, or by landing on a (−1) space.
- Preservers lost to a (−1) space return to Crazy Beach.
- Players with no Life Preservers are unaffected by a (−1) space.

**⚠️ Life Preserver spaces:** When you land on one, you must first take a Life Preserver from Crazy Beach. If none are there, take one from another player.

## 13. Risky Rapids

- Any player on Crazy River may choose to enter the rapids. The only way back is the way you came.
- No exact roll needed to reach the shore space at the end — just enough to get there.
- Reaching the shore space earns a **Crazy Coin.**
- In tournament play, every player who reaches the shore space also earns a **Sand Dollar.** **See the companion Board Layout Reference** for the exact 9-space sequence from the Crazy River offshoot to the shore, including both (−1) spaces' positions.
- **A bump's forced direction never changes a player's own established direction of travel:** A bump retreat inside Risky Rapids is always calculated toward the shore (the fixed-direction rule in Section 9) — but that's only the immediate, mechanical consequence of that one bump. It doesn't reset which way the player themselves is actually trying to go. That depends on whether they've already reached the shore on this trip: if not, their own forward direction stays toward the shore, same as before. If they've already reached it (already collected that trip's Crazy Coin) and are exiting, their own forward direction stays toward Crazy River — even right after a bump has just pushed them back toward the shore-ward side. They don't get to treat that repositioning as a fresh approach; their next turn resumes the exit already in progress. The only way to attempt the shore again after already reaching it is to fully exit Risky Rapids and then make an entirely fresh, deliberate choice to re-enter — exactly like a first-time entry (see below).
- **Bump direction inside Risky Rapids (the board's only two-way corridor):** A bump retreat always moves a player 2 spaces toward the fixed printed-forward direction — inside Risky Rapids, that means toward the shore space, regardless of which direction the player is actually traveling when bumped. This matters most on the return trip: a player heading back toward Crazy River who gets bumped does not retreat further toward Crazy River — they retreat 2 spaces back toward the shore instead. If that lands them exactly on the shore space, it counts as a brand-new arrival (Section 17) and they collect the next available reward. If it doesn't land them exactly on the shore, they don't get a fresh approach either — per the rule above, their next turn simply resumes heading back out toward Crazy River. **Example:** a player 2 spaces clear of the shore when bumped lands right back on it and gets another Crazy Coin. A player 3 or more spaces clear only gets pushed back partway — no coin, just a shorter remaining exit.
- **Confirmed: Risky Rapids' interior is water for Life Preserver purposes.** Losing a last Life Preserver to a bump while inside Risky Rapids triggers the same immediate-sink sequencing already established for Crazy River and the whirlpools (Section 9).
- **Getting bumped off the shore space itself does not grant another shot at a Crazy Coin.** The moment a player reaches the shore, they're already an "exiting" player by the established direction-persistence rule (above) — even before they've had a turn to actually start moving. A bump that repositions them 2 spaces back into the rapids doesn't undo that status; their next turn simply continues the exit already in progress, from wherever the retreat left them.
- **Board layout note — a (−1) space sits exactly 2 spaces back from the shore,** meaning a player bumped directly off the shore lands squarely on it. The consequences depend heavily on their Life Preserver count at that moment:
  - **Holding exactly 1:** Gives it up to the bumper while still on the (dry) shore — no sink there. But the retreat then lands them on this (−1) space already holding zero Life Preservers, which sinks them on arrival (same principle as the Crazy River reconvergence worked example below) — they never actually land back in Risky Rapids at all, going straight to Crazy Beach instead.
  - **Holding exactly 2:** Gives one to the bumper (1 left, still fine on the dry shore). The (−1) space's own action then costs their last remaining Life Preserver — losing it while standing on a water space triggers the standard sequencing sink (Section 9). Same result: Crazy Beach, not Risky Rapids.
  - **Holding 3 or more:** Survives both hits with at least 1 remaining. Lands on the (−1) space and simply continues their exit on their next turn — no coin, no sink.
- **Retreat that would cross the shore space:** Unlike the Start-capping rule (Section 9), the shore does not act as a hard boundary. Start has no space at all beyond it — a true board edge — while the shore is simply the functional endpoint of a bidirectional dead-end corridor with real, occupiable space on both sides of it. A bump retreat doesn't stop early at the shore; it applies its full 2 spaces, treating the shore as a normal pass-through point rather than a wall (space actions only trigger on final landing, never on being crossed mid-move — consistent with how every other space on the board works). Since there's no space beyond the shore in the forward direction, any retreat distance remaining after reaching it continues back the only other way available — toward Crazy River — rather than being discarded. Worked examples:
  - **Bumped exactly on the shore (0 spaces away):** the full 2-space retreat applies immediately toward Crazy River — matches the already-established rule.
  - **Bumped 1 space past the shore (1 exit step taken):** 1 space of retreat reaches the shore; the remaining 1 space continues back toward Crazy River, landing the player 1 space past the shore again — at this distance, the same space they occupied before the bump. No coin from the bump itself, but they're now perfectly positioned to reach the shore again on their very next turn (no exact roll needed) and earn a fresh Crazy Coin, barring another bump or swap in between.
  - **Bumped exactly 2 spaces from the shore, on either side:** the retreat exactly reaches the shore with nothing left over — a brand-new arrival, coin earned immediately.
  - **Bumped 3+ spaces from the shore on either side:** no shore-crossing occurs; the retreat simply lands short, no coin.
- **Bump retreat at the Risky Rapids junction space:** This space doubles as both a normal Crazy River space and the entry/exit point for Risky Rapids, making retreat direction ambiguous — the same principle as the board's other fork junctions (Section 9) applies, even though Risky Rapids is a dead-end spur rather than a parallel branch that merges back later. Retreat direction depends on the player's own most recent movement to reach this exact space:
  - If they just returned from Risky Rapids, a bump retreat sends them 2 spaces back *into* Risky Rapids, retracing the path they just came from.
  - If they arrived via normal forward movement along Crazy River (not by just returning from Risky Rapids), a bump retreat sends them 2 spaces backward along Crazy River instead.
  - **Confirmed:** a player knocked back into Risky Rapids this way does not get another shot at the shore. They've already completed that trip, so they're still an exiting player — their next turn resumes heading back out toward Crazy River, not toward the shore.

## 14. Crazy Coins

Powerful, stackable advantages, drawn when a player reaches the Risky Rapids shore.

- **Swap:** Hold this coin. On any future turn, instead of rolling, swap places with any player. **Mirrors the board Swap space exactly:** if that player has a Life Preserver, you take it from them, and you must complete the action on the space you swap to.
- **Take and Double:** Take ALL Life Preservers from Crazy Beach and other players (players currently in water must go to Crazy Beach). Then double all your rolls until you reach **Sharky Shores.**
- **Easy Win:** Exact roll not needed to win. If you draw a second Easy Win coin, you must give it to another player.
- **Surge:** Activates immediately. All other players freeze while you roll 5 times in a row, doubling each roll. Ignore all action spaces except Life Preserver spaces. If your final surge roll lands on a bad space, you must follow its rule.
- **Double Fours & Fives:** Roll a 4 or 5? You may double it if you want. This coin is yours for the rest of the game.
- **Bonus Golden Life Preserver:** Put on the golden bonus Life Preserver. It cannot be taken until you reach **Sharky Shores** — then it functions like any other preserver. This protection is universal — it blocks bumps, swaps, and Take and Double alike, not just one specific mechanic.

**Coin lifecycle — three states, not a simple reshuffle:**
- **Held coins (while unused)** stay with the player and are never part of any reshuffle: **Swap** (held only until the player chooses to execute it — once used, it moves to the discard pile like any other resolved coin, it is not a permanent hold), **Double Fours & Fives** (kept for the entire game, never discarded), and **Easy Win** (kept for the entire game unless a second copy forces a hand-off to another player).
- **Not all "held" coins work the same way when it comes to using them.** Swap is an *active* choice — a player uses their whole turn (instead of rolling) to execute it, exactly like the board Swap space. Double Fours & Fives and Easy Win are *passive, standing abilities* — they don't consume a turn to "use." Double Fours & Fives just applies automatically whenever a 4 or 5 comes up on any normal roll; Easy Win is a permanent modifier to the win condition with no activation moment at all. Don't describe either of these as something a player "waits for their turn to use" — only Swap works that way.
- **Used coins** are set aside in a discard pile once resolved — they do **not** go back into the draw stack right away: **Surge** (resolves immediately upon drawing), **Take and Double** (its Life Preserver-taking effect is instant; the lingering doubling is tracked as a status, not tied to the physical card), **Bonus Golden Life Preserver** (converts into a board token, not an ongoing card ability), and **Swap** (once actually executed — before that, it's held).
- Once the draw stack itself runs out (very rare), the discard pile is shuffled and becomes the new stack. Coins still actively held (Double Fours & Fives, Easy Win, or an unused Swap) are never included in this reshuffle, since they haven't left player hands.

**Strategic notes (for richer player-facing answers, not mechanical rules):**
- **Double Fours & Fives** is valuable specifically because doubling is optional — a player can dodge a roll that would land on a negative space, aim for a positive one instead, or in some cases land an exact winning roll on the Castle by doubling a 5.
- **Swap** is powerful both offensively and defensively — it can propel a player straight toward the end when conditions are right (a good target player, favorable Life Preserver count), or be used purely to stop another player from winning. One especially strong combo: swapping with a player stuck in a Sharky Shores whirlpool who's holding at least one Life Preserver — the swapper steals that Life Preserver and lands in a strong position near the Castle.

## 15. Tournament Play

- **Earning Sand Dollars:** Conquer Risky Rapids → 1 Sand Dollar. Win a game → 3 Sand Dollars.
- **Winning the tournament:** First player to the required Sand Dollar count wins.
- **Crazy Coins reset each game.** Held coins (Swap, Double Fours & Fives, Easy Win) do not carry over from one tournament game into the next — the Crazy Coin stack is freshly shuffled at the start of every new game, same as Setup (Section 2). Only Sand Dollars persist across the tournament.

| Players | Standard Tournament | Crazy Tournament Mode |
|---|---|---|
| 2 players | 12 | 15 |
| 3–6 players | 10 | 12 |

⚠️ If a player's Risky Rapids Sand Dollar pushes them over the threshold, the current game must still play out until someone reaches the Castle — then the tournament winner is crowned.

## 16. Crazy Tournament Mode — Bonus Roll

Winning a game in Crazy Tournament Mode triggers a mandatory Crazy Bonus Roll:

| Roll | Result |
|---|---|
| 1 | Small Bonus — earn 1 Sand Dollar |
| 2 | Victory Grows! — earn 2 Sand Dollars |
| 3 | Huge Win! — earn 3 Sand Dollars |
| 4 | STACKED! — earn 2 Sand Dollars; next game you start at Crazy Beach wearing ALL Life Preservers and roll first; everyone else starts at normal Start |
| 5 | Rough Break — no bonus; next game you start at normal Start, everyone else starts at Crazy Beach with a Life Preserver |
| 6 | DISASTER! — no bonus, every other player gets 1 Sand Dollar; next game you start at normal Start, everyone else starts at Crazy Beach with a Life Preserver |

## 17. Consolidated Edge Cases

**Game Mechanics**
- *All players stuck in Mud on consecutive turns* → Lost turns cancel out; continue as normal.
- *Player bumped at a crossroads with more than one path back* → See Section 9 — retrace the exact path just traveled, never a new choice.
- *Player bumped off a mud space, whether or not they'd already retrieved their die* → Any pending obligation clears immediately — they retrieve their die (if it was still in the puddle) and continue play normally from their new position 2 spaces back. Leaving the mud space clears the obligation regardless of how they left it.
- *Player bumped to a star and takes their free turn* → Per the general turn-order principle (Section 3), the next turn goes to the player after the one who just rolled — which here is the bumped player, since their star roll was the most recent turn taken. This is not a special bump rule; it would be true of any player landing on a star by any means.
- *Player bumped to a plain space with no bonus action* → No extra roll happens, so nothing changes about whose turn was "last" — the bumping player is still the most recent one to have taken a turn. Play proceeds normally to the player after the *bumping* player, exactly as it would have if no bump had happened at all.

**Swaps**
- *Player lands on a Swap space* → Must swap, even at a disadvantage. **Takes a Life Preserver from the other player if they have one.**
- *A swap lands a player in water with zero Life Preservers* (i.e., neither player involved had one to transfer) → That player must come ashore at Crazy Beach.
- *Player swaps with someone at the Risky Rapids shore space* → Must complete that space's action and receives the next available Crazy Coin (and Sand Dollar, in tournament play). Standard Life Preserver transfer rule still applies if the other player has one.

**Life Preservers**
- *A player lands on another player AND a Life Preserver space simultaneously* → Take two: one from the bumped player, one from Crazy Beach (or any player if Beach is empty).
- *Player with only one Life Preserver is bumped while in water* → No moving back — they immediately lose their preserver and go ashore at Crazy Beach.
- *Player loses their last Life Preserver in Risky Rapids via a (−1) space* → Preserver goes to Crazy Beach; player goes there too and picks it back up.
- *Another player lands on Crazy Beach where a player already is* → No bump. Crazy Beach is the only space where multiple players can coexist.
- *Player with no Life Preservers bumps someone on a (−1) space who has one* → Take one preserver as usual, then follow the (−1) action — lose it and go to Crazy Beach.
- *Player barely inside Crazy River with only one Life Preserver gets bumped* → Loses the Life Preserver first (proximity handover, since both players share the same space), immediately sinks because they're still standing in the water, and re-enters at Crazy Beach. The 2-space retreat never happens — sinking overrides it.
- *Player sitting on the first of the 3 whirlpools with only one Life Preserver gets bumped* → Same sequencing: loses the Life Preserver first, immediately sinks since they're still on the whirlpool, and re-enters at Crazy Beach instead of retreating.

**Risky Rapids**
- *Player lands on another player already at the shore space* → Standard bump: bumped player gives up a Life Preserver and moves back 2 spaces into the water. If they make it back to shore, it counts as a brand-new arrival — they collect the next available reward.
- *Bumped player at the shore space has no Life Preserver* → Cannot survive in the water; must be rescued to Crazy Beach immediately.
- *Player returns to the shore space by any other means (swap or bumped back)* → Counts as a brand-new arrival — collect the next available reward.
- *Player is partway back into Risky Rapids on the return trip toward Crazy River and gets bumped* → Retreat still moves toward the shore (the fixed printed direction), never further toward Crazy River. If this lands them exactly on the shore space, it's a brand-new arrival and they collect the next available reward. If not, they don't get a fresh approach either — their next turn resumes heading back out toward Crazy River, since they'd already reached the shore on this trip.
- *Player at the Risky Rapids junction space, having just returned from the rapids, gets bumped* → Retreats 2 spaces back into Risky Rapids, retracing their own most recent path — not backward along Crazy River. A player arriving at that same space via normal forward Crazy River movement (not fresh off a rapids run) retreats along Crazy River instead. Either way, this doesn't grant another shot at the shore — a player already exiting stays an exiting player; their next turn resumes heading toward Crazy River.

**Crazy Coins**
- *Surge player's final roll lands on a negative space* → Must follow the action on that space.
- *Player with "Take and Double" rolls, lands on an escape box* → Still roll one of the two escape numbers, but double that roll amount.
- *Player using "Take and Double" then draws a Surge coin* → Surge activates immediately — all rolls doubled, negative spaces ignored (except Life Preserver spaces). If Surge carries past **Sharky Shores**, Take and Double expires. If not, doubling continues after Surge ends.
- *Player holding Double Fours & Fives also has Take and Double active (stacked)* → Take and Double's blanket doubling takes precedence for the duration of its window — a roll of 4 or 5 is doubled once, not compounded by both effects. Double Fours & Fives isn't consumed or lost; it simply has nothing extra to contribute while Take and Double is active, and should resume being the player's option on future 4/5 rolls once Take and Double's doubling window ends at Sharky Shores.
- *Player draws Take and Double while another player holds the Bonus Golden Life Preserver, not yet at Sharky Shores* → The Golden Life Preserver is protected by its own explicit rule and cannot be taken. Take and Double's "take all" action happens once, immediately upon drawing — no retroactive taking later, even if the golden preserver's holder reaches Sharky Shores afterward while the doubling window is still active. The only way it gets swept up is if its holder had *already* reached Sharky Shores before Take and Double was drawn, since it's already functioning as a normal preserver by then. **AI agent guidance:** Keep the default answer to just "it's protected until they reach Sharky Shores; the only way to get it is if they've already reached it" — don't proactively explain the one-time/no-retroactive-taking nuance. That's a follow-up-level detail most players won't think to ask about; only bring it up if someone specifically asks what happens if the holder reaches Sharky Shores *during* an active doubling window.
- *Player swaps with someone holding the Bonus Golden Life Preserver, not yet at Sharky Shores* → The golden preserver doesn't transfer — same universal protection as with Take and Double. If the swapee also holds a regular Life Preserver, that one transfers normally per the standard swap rule; the golden one stays with them regardless until they reach Sharky Shores.

## 18. Side Notes — Additional Resolved Scenarios

Scenarios resolved through direct Q&A that don't fit the terse "if X then Y" format of the Consolidated Edge Cases above, but are fully confirmed and carry equal authority.

- *Player lands on a Risky Rapids (−1) space with only one Life Preserver* → Loses the Life Preserver (it goes to Crazy Beach), then immediately sinks since they're now in water with zero Life Preservers, re-entering at Crazy Beach — where they immediately reclaim the very Life Preserver they just lost, per the standard Crazy Beach re-entry rule (Section 5).
- *Player lands on another player who is standing on a Life Preserver space* → Gets two Life Preservers from that single move: one from the bump (if the other player has one), and one from the space itself (Crazy Beach, or another player if Beach is empty). The two sources are independent — if the bumped player has none to give, the bumper still gets exactly one from the space.
- *A Life Preserver arrives at Crazy Beach mid-game (e.g., another player loses one there via a (−1) space) while a different player is already sitting at Crazy Beach waiting for their next turn* → The waiting player does **not** get it. The "take a Life Preserver" rule is tied to the act of *re-entering* Crazy Beach after sinking, not to merely being present when one becomes available. That Life Preserver stays there for whoever next actually sinks and re-enters — not for a player who was already sitting there beforehand.

## 19. Presentation Notes (Physical Materials Only — Not AI Agent Gaps)

Both items below are now fully confirmed and included in this document — the AI agent has everything it needs to answer correctly. What remains is purely a printed-rulebook layout question, being handled separately:

1. **Escape boxes** — mechanic confirmed (Section 3), but a live tester was confused by the icon-only explanation on the board key. Slated to be added alongside the mud/star explanation in the printed rules.
2. **Portals** — mechanic confirmed (Section 11), never had written rules text anywhere. Slated for the same treatment.

---

*End of Master Rules Reference v2.*
