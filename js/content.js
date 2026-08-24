// ==========================================================
// AFFILIATE DEAL WORKBENCH - CONTENT STUDIO
// ==========================================================

let savedDeals = [];

// ==========================================================
// 10 TEMPLATES PER SOCIAL MEDIA PLATFORM (60 TOTAL)
// ==========================================================
const TEMPLATES = {
    instagram: [
        {
            id: "ig_loot",
            name: "1. 🔥 Mega Loot Alert",
            render: function(d) {
                var couponText = d.coupon ? "\n🎟️ Coupon Code: " + d.coupon : "";
                var tag = d.store.replace(/\s+/g, "");
                return "🔥 UNBELIEVABLE PRICE DROP! 🔥\n\n" +
                       "Grab the " + d.product + " at a massive " + d.discount + "% discount!\n\n" +
                       "🏷️ Deal Price: ₹" + d.price + "\n" +
                       "❌ MRP: ₹" + d.origPrice + "\n" +
                       "🏪 Store: " + d.store + couponText + "\n\n" +
                       "🛒 Link in Bio to purchase!\n" +
                       "⏰ Limited period deal. Grab yours now!\n\n" +
                       "#Deals #MegaSale #OnlineShopping #" + tag + "Deals #LootOffer #Discounts";
            }
        },
        {
            id: "ig_minimal",
            name: "2. ✨ Clean & Minimal",
            render: function(d) {
                var couponText = d.coupon ? "\n• Extra Savings: Use code " + d.coupon : "";
                var tag = d.store.replace(/\s+/g, "");
                return "✨ Daily Deal Spotlight ✨\n\n" +
                       "• Item: " + d.product + "\n" +
                       "• Offer: ₹" + d.price + " (MRP: ₹" + d.origPrice + " - " + d.discount + "% OFF)\n" +
                       "• Platform: " + d.store + couponText + "\n\n" +
                       "👉 Head over to the link in our bio to shop.\n\n" +
                       "#ShoppingMadeEasy #SmartShopper #SaveMoney #" + tag;
            }
        },
        {
            id: "ig_story_caption",
            name: "3. 📱 Story / Reel Hook",
            render: function(d) {
                var couponText = d.coupon ? "Don't forget to apply code " + d.coupon + " at checkout." : "";
                return "Stop scrolling! 🚨 " + d.product + " is down to ₹" + d.price + " right now on " + d.store + ".\n\n" +
                       "That's a full " + d.discount + "% OFF! " + couponText + "\n\n" +
                       "Tap the bio link before prices go back up! 🏃💨\n\n" +
                       "#StealDeal #FlashSale #BudgetShopping #InstaDeals";
            }
        },
        {
            id: "ig_value_buyer",
            name: "4. 💡 Value Proposition",
            render: function(d) {
                var couponText = d.coupon ? "🎁 Bonus Discount: Apply code \"" + d.coupon + "\"\n\n" : "";
                return "Looking for the best deal on " + d.product + "? 💡\n\n" +
                       "It's currently retailing for just ₹" + d.price + " instead of ₹" + d.origPrice + " on " + d.store + ". You save " + d.discount + "%!\n\n" +
                       couponText + "Check the bio link for the official offer link.\n\n" +
                       "#BestDeals #SmartBuyer #ShopSmart #DealHunter";
            }
        },
        {
            id: "ig_urgency",
            name: "5. ⏳ Time Running Out",
            render: function(d) {
                var couponText = d.coupon ? "\n🎟️ Code: " + d.coupon : "";
                return "⏳ TICKING CLOCK DEAL! ⏳\n\n" +
                       d.product + " is selling out rapidly at ₹" + d.price + " (Was ₹" + d.origPrice + ")!\n\n" +
                       "🏪 Available at: " + d.store + "\n" +
                       "💥 Savings: " + d.discount + "% OFF" + couponText + "\n\n" +
                       "Direct link updated in bio. Grab it immediately! 👇\n\n" +
                       "#HurryUp #LimitedStock #PriceCrash #SaleAlert";
            }
        },
        {
            id: "ig_gift_recommendation",
            name: "6. 🎁 Perfect Gift Pick",
            render: function(d) {
                var couponText = d.coupon ? "Use promo code " + d.coupon + " for extra discounts!\n\n" : "";
                return "Looking for a great gift or personal upgrade? 🎁\n\n" +
                       d.product + " is on sale on " + d.store + " for only ₹" + d.price + " (Save " + d.discount + "% off ₹" + d.origPrice + ").\n\n" +
                       couponText + "🔗 Direct purchase link in bio.\n\n" +
                       "#GiftIdeas #Wishlist #TopPicks #ShopNow";
            }
        },
        {
            id: "ig_comparison",
            name: "7. 📊 Price Comparison Win",
            render: function(d) {
                var couponText = d.coupon ? "Use coupon: " + d.coupon : "";
                return "Price check! 📉\n\n" +
                       "Original retail: ₹" + d.origPrice + "\n" +
                       "Current offer: ₹" + d.price + "\n" +
                       "Total saved: " + d.discount + "%\n\n" +
                       "Get " + d.product + " on " + d.store + " today! " + couponText + "\n\n" +
                       "Tap the link in bio to place your order. 🛍️\n\n" +
                       "#PriceDrop #SavingsTracker #BargainFinds";
            }
        },
        {
            id: "ig_aesthetic",
            name: "8. 🤍 Aesthetic Lifestyle",
            render: function(d) {
                var couponText = d.coupon ? "\n🏷️ Code: " + d.coupon : "";
                return "Upgrade your setup with " + d.product + " 🤍\n\n" +
                       "Now at a special price of ₹" + d.price + " (Retail ₹" + d.origPrice + ") exclusively on " + d.store + "." + couponText + "\n\n" +
                       "Tap our bio link to check availability & colors.\n\n" +
                       "#LifestyleUpgrade #Essentials #DailyDeals";
            }
        },
        {
            id: "ig_weekend_special",
            name: "9. 🎈 Festival / Weekend Offer",
            render: function(d) {
                var couponText = d.coupon ? "\n🎟️ Promo: " + d.coupon : "";
                return "Weekend Special Offer! 🎈\n\n" +
                       "Score " + d.product + " at ₹" + d.price + " (Original price ₹" + d.origPrice + ").\n\n" +
                       "🛍️ Store: " + d.store + "\n" +
                       "🎉 Discount: " + d.discount + "% OFF" + couponText + "\n\n" +
                       "Bio link takes you directly to the deal page!\n\n" +
                       "#WeekendSale #DealOfTheDay #ShoppingSpree";
            }
        },
        {
            id: "ig_short_punchy",
            name: "10. ⚡ Short & Snappy",
            render: function(d) {
                var couponText = d.coupon ? "Code: " + d.coupon + ". " : "";
                return "⚡ DEAL: " + d.product + " is ₹" + d.price + " (" + d.discount + "% OFF ₹" + d.origPrice + ") on " + d.store + "! " + couponText + "Link in bio! 🏃\n\n#Deals #QuickDeal #ShopNow";
            }
        }
    ],

    facebook: [
        {
            id: "fb_community_deal",
            name: "1. 📢 Community Deal Alert",
            render: function(d) {
                var couponText = d.coupon ? "\n🎟️ Coupon Code: " + d.coupon : "";
                return "📢 HUGE PRICE DROP FOR OUR MEMBERS!\n\n" +
                       "If you've been planning to buy " + d.product + ", here is your chance. It is currently available on " + d.store + " for just ₹" + d.price + " (Original MRP: ₹" + d.origPrice + ").\n\n" +
                       "💰 Total Discount: " + d.discount + "% OFF" + couponText + "\n\n" +
                       "🛒 Direct Order Link: " + d.url + "\n\n" +
                       "Share this post with your friends and family so they don't miss out!";
            }
        },
        {
            id: "fb_detailed_review",
            name: "2. 📝 Recommendation Post",
            render: function(d) {
                var couponText = d.coupon ? "Promo Code: " + d.coupon + "\n" : "";
                return "Highly Recommended Offer! ⭐⭐⭐⭐⭐\n\n" +
                       "Product: " + d.product + "\n" +
                       "Store: " + d.store + "\n" +
                       "Deal Price: ₹" + d.price + " (MRP: ₹" + d.origPrice + " - You Save " + d.discount + "%)\n" +
                       couponText +
                       "This is currently the lowest recorded price. Get yours before stock runs out:\n" +
                       "👉 " + d.url;
            }
        },
        {
            id: "fb_price_drop",
            name: "3. 📉 Massive Discount Alert",
            render: function(d) {
                var couponText = d.coupon ? "Apply coupon \"" + d.coupon + "\" for extra discount!\n" : "";
                return "📉 Price Drop Notification!\n\n" +
                       d.product + " has dropped from ₹" + d.origPrice + " down to ₹" + d.price + " on " + d.store + " (" + d.discount + "% Discount).\n\n" +
                       couponText +
                       "Check it out here 👉 " + d.url;
            }
        },
        {
            id: "fb_urgent_deal",
            name: "4. ⏰ Limited Quantity Notice",
            render: function(d) {
                return "⏰ LIMITED STOCK DEAL ALERT!\n\n" +
                       d.store + " is offering " + d.product + " at ₹" + d.price + " (MRP ₹" + d.origPrice + ") for a short duration!\n\n" +
                       "Grab it now: " + d.url;
            }
        },
        {
            id: "fb_budget_friendly",
            name: "5. 💸 Budget Shopper Pick",
            render: function(d) {
                return "Looking for high value on a budget? 💸\n\n" +
                       d.product + " is on sale today at ₹" + d.price + " on " + d.store + " with a massive " + d.discount + "% discount.\n\n" +
                       "Direct Link to Buy: " + d.url;
            }
        },
        {
            id: "fb_qna_style",
            name: "6. 🤔 Looking for deals on this?",
            render: function(d) {
                var couponText = d.coupon ? " Use code " + d.coupon + "." : "";
                return "Looking for a great offer on " + d.product + "? 🤔\n\n" +
                       "It is live on " + d.store + " for just ₹" + d.price + " instead of ₹" + d.origPrice + "!" + couponText + "\n\n" +
                       "Order here: " + d.url;
            }
        },
        {
            id: "fb_comparison",
            name: "7. 🏷️ MRP vs Deal Comparison",
            render: function(d) {
                return "🔥 Great Savings Today!\n\n" +
                       "❌ Regular Price: ₹" + d.origPrice + "\n" +
                       "✅ Deal Price: ₹" + d.price + "\n" +
                       "📉 You Save: " + d.discount + "%\n\n" +
                       "Order " + d.product + " from " + d.store + " now:\n" +
                       "🔗 " + d.url;
            }
        },
        {
            id: "fb_weekend_find",
            name: "8. 🛍️ Weekend Special",
            render: function(d) {
                return "Top pick of the day! 🛍️\n\n" +
                       "Get the " + d.product + " at ₹" + d.price + " (" + d.discount + "% OFF) on " + d.store + ".\n\n" +
                       "Check deal details & order: " + d.url;
            }
        },
        {
            id: "fb_coupon_focus",
            name: "9. 🎟️ Special Coupon Savings",
            render: function(d) {
                var couponText = d.coupon ? "Make sure to enter code \"" + d.coupon + "\" at checkout!\n" : "";
                return "🎟️ SPECIAL COUPON OFFER!\n\n" +
                       d.product + " is available on " + d.store + " for ₹" + d.price + " (Original: ₹" + d.origPrice + ").\n" +
                       couponText +
                       "Shop now: " + d.url;
            }
        },
        {
            id: "fb_clean_link",
            name: "10. 🔗 Clean Direct Share",
            render: function(d) {
                var couponText = d.coupon ? "Code: " + d.coupon + "\n" : "";
                return d.product + " on " + d.store + "\n" +
                       "Price: ₹" + d.price + " | MRP: ₹" + d.origPrice + " (" + d.discount + "% OFF)\n" +
                       couponText +
                       "Buy Link: " + d.url;
            }
        }
    ],

    telegram: [
        {
            id: "tg_loot",
            name: "1. 🔥 Markdown Loot (Bold/Italic)",
            render: function(d) {
                var couponText = d.coupon ? "\n🎟 **Code:** `" + d.coupon + "`" : "";
                return "🔥 **SUPER LOOT DEAL** 🔥\n\n" +
                       "🛍 **" + d.product + "**\n\n" +
                       "💥 **Deal Price:** ₹" + d.price + "\n" +
                       "❌ **MRP:** ~~₹" + d.origPrice + "~~\n" +
                       "📉 **Discount:** " + d.discount + "% OFF\n" +
                       "🏪 **Store:** " + d.store + couponText + "\n\n" +
                       "🛒 **Buy Link:** " + d.url;
            }
        },
        {
            id: "tg_lightning",
            name: "2. ⚡ Lightning Fast Share",
            render: function(d) {
                var couponText = d.coupon ? "\n🎟 Code: `" + d.coupon + "`" : "";
                return "⚡ **" + d.product + "**\n\n" +
                       "👉 ₹" + d.price + " ~~₹" + d.origPrice + "~~ (" + d.discount + "% OFF)\n" +
                       "🏪 " + d.store + couponText + "\n\n" +
                       "🔗 " + d.url;
            }
        },
        {
            id: "tg_code_box",
            name: "3. 🎟️ Tap to Copy Coupon",
            render: function(d) {
                var couponText = d.coupon ? "🎟 **Tap Code to Copy:** `" + d.coupon + "`\n" : "";
                return "🚨 **PRICE CRASH ON " + d.store.toUpperCase() + "** 🚨\n\n" +
                       "📦 **Item:** " + d.product + "\n" +
                       "💰 **Price:** ₹" + d.price + " (Save " + d.discount + "%)\n" +
                       couponText +
                       "\n👇 **Order Fast:**\n" + d.url;
            }
        },
        {
            id: "tg_stock_alert",
            name: "4. ⏰ Low Stock Alert",
            render: function(d) {
                return "⏰ **STOCK RUNNING OUT FAST!**\n\n" +
                       "**" + d.product + "** is available at just **₹" + d.price + "** (MRP: ~~₹" + d.origPrice + "~~) on " + d.store + "!\n\n" +
                       "🔗 **Direct Link:** " + d.url;
            }
        },
        {
            id: "tg_box_design",
            name: "5. 📦 Bordered Box Layout",
            render: function(d) {
                var couponText = d.coupon ? "\n🔹 **Coupon:** `" + d.coupon + "`" : "";
                return "┏━━━━━━━━━━━━━━━━━━━┓\n" +
                       "   🔥 **DEAL OF THE DAY** 🔥\n" +
                       "┗━━━━━━━━━━━━━━━━━━━┛\n\n" +
                       "📌 **" + d.product + "**\n\n" +
                       "🔹 **Offer Price:** ₹" + d.price + "\n" +
                       "🔹 **Actual Price:** ~~₹" + d.origPrice + "~~\n" +
                       "🔹 **Flat Discount:** " + d.discount + "%\n" +
                       "🔹 **Store:** " + d.store + couponText + "\n\n" +
                       "👉 **BUY HERE:** " + d.url;
            }
        },
        {
            id: "tg_lowest_price",
            name: "6. 📉 All-Time Lowest Price",
            render: function(d) {
                return "📉 **ALL TIME LOWEST PRICE!**\n\n" +
                       "**" + d.product + "**\n\n" +
                       "Now: ₹" + d.price + " | MRP: ~~₹" + d.origPrice + "~~\n" +
                       "Platform: " + d.store + "\n\n" +
                       "🛒 **Grab immediately:** " + d.url;
            }
        },
        {
            id: "tg_emoji_bullet",
            name: "7. 🎯 Clean Emoji Bulleted",
            render: function(d) {
                var couponText = d.coupon ? "\n▫️ **Code:** `" + d.coupon + "`" : "";
                return "🎯 **Steal Deal Found!**\n\n" +
                       "▫️ **Product:** " + d.product + "\n" +
                       "▫️ **Deal Price:** ₹" + d.price + "\n" +
                       "▫️ **Original:** ~~₹" + d.origPrice + "~~\n" +
                       "▫️ **Discount:** " + d.discount + "% OFF" + couponText + "\n\n" +
                       "🚀 **Shop Now:** " + d.url;
            }
        },
        {
            id: "tg_verified",
            name: "8. ✅ Verified & Tested",
            render: function(d) {
                return "✅ **VERIFIED WORKING DEAL**\n\n" +
                       d.product + " is active on " + d.store + " for ₹" + d.price + ".\n\n" +
                       "🔗 " + d.url;
            }
        },
        {
            id: "tg_one_liner",
            name: "9. 🏃 Quick One-Liner",
            render: function(d) {
                return "🔥 **" + d.product + "** @ **₹" + d.price + "** (" + d.discount + "% OFF on " + d.store + ") 👉 " + d.url;
            }
        },
        {
            id: "tg_festive",
            name: "10. 🎉 Festive Special Blast",
            render: function(d) {
                return "🎉 **FESTIVAL LOOT OFFER** 🎉\n\n" +
                       "**" + d.product + "**\n" +
                       "Deal Price: ₹" + d.price + " (Save " + d.discount + "%)\n" +
                       "Store: " + d.store + "\n\n" +
                       "👉 **Order Now:** " + d.url;
            }
        }
    ],

    whatsapp: [
        {
            id: "wa_broadcast_full",
            name: "1. 📢 Complete Broadcast Message",
            render: function(d) {
                var couponText = d.coupon ? "\n*Coupon:* " + d.coupon : "";
                return "*🔥 SPECIAL OFFER ALERT! 🔥*\n\n" +
                       "*Product:* " + d.product + "\n" +
                       "*Deal Price:* ₹" + d.price + "\n" +
                       "*MRP:* ~₹" + d.origPrice + "~\n" +
                       "*Savings:* " + d.discount + "% OFF\n" +
                       "*Store:* " + d.store + couponText + "\n\n" +
                       "*Order Now:* 👇\n" +
                       d.url + "\n\n" +
                       "_Forward to your groups and friends!_";
            }
        },
        {
            id: "wa_clean_compact",
            name: "2. ✨ Compact & Clean",
            render: function(d) {
                var couponText = d.coupon ? "\n👉 *Code:* " + d.coupon : "";
                return "*" + d.product + "*\n\n" +
                       "👉 *Deal Price:* ₹" + d.price + " (~₹" + d.origPrice + "~ - " + d.discount + "% OFF)\n" +
                       "👉 *Store:* " + d.store + couponText + "\n\n" +
                       "*Buy Link:* " + d.url;
            }
        },
        {
            id: "wa_family_forward",
            name: "3. 👨‍👩‍👧 Friendly Forward",
            render: function(d) {
                return "Hey! Look at this deal on *" + d.product + "* on " + d.store + ".\n\n" +
                       "It is available for just *₹" + d.price + "* (Original ₹" + d.origPrice + ").\n\n" +
                       "Link to buy: " + d.url;
            }
        },
        {
            id: "wa_price_alert",
            name: "4. 🚨 Urgent Deal Alert",
            render: function(d) {
                return "*🚨 PRICE DROP on " + d.store + "! 🚨*\n\n" +
                       "*" + d.product + "* is now *₹" + d.price + "* (" + d.discount + "% OFF).\n\n" +
                       "Grab it here before stock ends: " + d.url;
            }
        },
        {
            id: "wa_status_format",
            name: "5. 📱 Status / Story Format",
            render: function(d) {
                return "*" + d.product + "* @ *₹" + d.price + "* only! (MRP ₹" + d.origPrice + ")\n\n" +
                       "Available on " + d.store + ". DM me or tap link: " + d.url;
            }
        },
        {
            id: "wa_budget_pick",
            name: "6. 💰 Budget Savings Pick",
            render: function(d) {
                return "*💰 Money Saver Deal! 💰*\n\n" +
                       "Get *" + d.product + "* on " + d.store + " for ₹" + d.price + " with " + d.discount + "% savings.\n\n" +
                       "Link: " + d.url;
            }
        },
        {
            id: "wa_bullet_clean",
            name: "7. 🔹 Bulleted Highlights",
            render: function(d) {
                var couponText = d.coupon ? "\n🔹 Code: " + d.coupon : "";
                return "*Deal Highlights:*\n" +
                       "🔹 Item: " + d.product + "\n" +
                       "🔹 Price: ₹" + d.price + " (Original: ~₹" + d.origPrice + "~)\n" +
                       "🔹 Store: " + d.store + couponText + "\n\n" +
                       "👉 Buy: " + d.url;
            }
        },
        {
            id: "wa_today_only",
            name: "8. ⏳ Valid Today Only",
            render: function(d) {
                return "*⏳ Offer Valid For Limited Time!*\n\n" +
                       "*" + d.product + "* is selling at *₹" + d.price + "* on " + d.store + ".\n\n" +
                       "Order here: " + d.url;
            }
        },
        {
            id: "wa_shopping_group",
            name: "9. 🛒 Shopping Group Drop",
            render: function(d) {
                return "*🛒 Group Deal Share:*\n\n" +
                       d.product + " -> *₹" + d.price + "* (MRP ₹" + d.origPrice + ")\n" +
                       "Platform: " + d.store + "\n\n" +
                       "Link: " + d.url;
            }
        },
        {
            id: "wa_ultra_short",
            name: "10. ⚡ Instant Link",
            render: function(d) {
                return "*" + d.product + "* at *₹" + d.price + "* (" + d.discount + "% OFF) on " + d.store + "!\n👉 " + d.url;
            }
        }
    ],

    twitter: [
        {
            id: "tw_viral_drop",
            name: "1. 🔥 Viral Price Drop (280 char)",
            render: function(d) {
                var couponText = d.coupon ? "\n\nUse Code: " + d.coupon : "";
                var tag = d.store.replace(/\s+/g, "");
                return "🔥 PRICE DROP ALERT!\n\n" +
                       d.product + " is down to ₹" + d.price + " on #" + tag + " (MRP: ₹" + d.origPrice + " - " + d.discount + "% OFF)!" +
                       couponText + "\n\n" +
                       "Get it here 👇\n" + d.url + "\n\n#Deals #Shopping";
            }
        },
        {
            id: "tw_punchy_short",
            name: "2. ⚡ Ultra Punchy",
            render: function(d) {
                return "⚡ Massive " + d.discount + "% OFF on " + d.product + "!\n\n" +
                       "💰 ₹" + d.price + " (MRP: ₹" + d.origPrice + ")\n" +
                       "🏬 " + d.store + "\n\n" +
                       "Buy: " + d.url + "\n\n#DealOfTheDay";
            }
        },
        {
            id: "tw_thread_starter",
            name: "3. 🧵 Deal Thread Hook",
            render: function(d) {
                var couponText = d.coupon ? " Code: " + d.coupon : "";
                return "Best deal of the hour 🧵👇\n\n" +
                       d.product + " is retailing for ₹" + d.price + " instead of ₹" + d.origPrice + " on " + d.store + "." +
                       couponText + "\n\nLink: " + d.url;
            }
        },
        {
            id: "tw_hashtag_rich",
            name: "4. 🏷️ Trending Hashtags",
            render: function(d) {
                return "🚨 LOOT: " + d.product + " at ₹" + d.price + " (" + d.discount + "% OFF)!\n\n" +
                       "Store: " + d.store + "\n" +
                       "Link: " + d.url + "\n\n" +
                       "#DealsIndia #OnlineShopping #Discounts #Sale";
            }
        },
        {
            id: "tw_quote_style",
            name: "5. 💡 Value Highlight",
            render: function(d) {
                return "Why pay ₹" + d.origPrice + " when you can get " + d.product + " for ₹" + d.price + " on " + d.store + "?\n\n" +
                       "Save " + d.discount + "% today 👉 " + d.url;
            }
        },
        {
            id: "tw_stock_alert",
            name: "6. ⏰ Fast Stock Alert",
            render: function(d) {
                return "⏰ Stock running out on " + d.store + "!\n\n" +
                       d.product + " is just ₹" + d.price + " right now.\n\n" +
                       "Grab it: " + d.url;
            }
        },
        {
            id: "tw_emoji_heavy",
            name: "7. 💥 Emoji Packed",
            render: function(d) {
                return "💥 BIG SAVINGS 💥\n\n" +
                       "📦 " + d.product + "\n" +
                       "💵 ₹" + d.price + " (MRP: ₹" + d.origPrice + ")\n" +
                       "🏷️ " + d.discount + "% OFF on " + d.store + "\n\n" +
                       "🔗 " + d.url;
            }
        },
        {
            id: "tw_simple_link",
            name: "8. 🎯 Minimalist Tweet",
            render: function(d) {
                return d.product + " is on sale for ₹" + d.price + " (" + d.discount + "% OFF) on " + d.store + ".\n\n" + d.url;
            }
        },
        {
            id: "tw_weekend_post",
            name: "9. 🎉 Weekend Deal Drop",
            render: function(d) {
                return "Weekend Special: " + d.product + " is available for ₹" + d.price + " (Original: ₹" + d.origPrice + ").\n\nLink: " + d.url;
            }
        },
        {
            id: "tw_code_mention",
            name: "10. 🎟️ Coupon Highlight",
            render: function(d) {
                var couponText = d.coupon ? "Use promo code " + d.coupon + " at checkout. " : "";
                return "Grab " + d.product + " on " + d.store + " for ₹" + d.price + "! " + couponText + "👉 " + d.url;
            }
        }
    ],

    reddit: [
        {
            id: "rd_deals_sub",
            name: "1. 🏷️ [Deal/Discounts] Standard Title & Body",
            render: function(d) {
                var couponText = d.coupon ? "\n* **Coupon Code:** `" + d.coupon + "`" : "";
                return "**[" + d.store + "] " + d.product + " - ₹" + d.price + " (" + d.discount + "% OFF from ₹" + d.origPrice + ")**\n\n" +
                       "### Deal Summary\n" +
                       "* **Item:** " + d.product + "\n" +
                       "* **Price:** ₹" + d.price + "\n" +
                       "* **Original Price:** ₹" + d.origPrice + "\n" +
                       "* **Savings:** " + d.discount + "%" + couponText + "\n" +
                       "* **Store:** " + d.store + "\n\n" +
                       "[Link to Deal](" + d.url + ")";
            }
        },
        {
            id: "rd_table_layout",
            name: "2. 📊 Markdown Table Format",
            render: function(d) {
                return "### 💥 Price Drop Alert: " + d.product + "\n\n" +
                       "| Detail | Information |\n" +
                       "| :--- | :--- |\n" +
                       "| **Product** | " + d.product + " |\n" +
                       "| **Deal Price** | **₹" + d.price + "** |\n" +
                       "| **MRP** | ~~₹" + d.origPrice + "~~ |\n" +
                       "| **Discount** | **" + d.discount + "% OFF** |\n" +
                       "| **Store** | " + d.store + " |\n" +
                       (d.coupon ? "| **Coupon** | `" + d.coupon + "` |\n" : "") +
                       "\n**Direct Link:** [" + d.product + " on " + d.store + "](" + d.url + ")";
            }
        },
        {
            id: "rd_frugal_india",
            name: "3. 💡 Frugal / Value Discussion",
            render: function(d) {
                var couponText = d.coupon ? " Make sure to apply code `" + d.coupon + "`." : "";
                return "**Good deal found on " + d.product + " (" + d.discount + "% discount)**\n\n" +
                       "Found this while browsing " + d.store + ". " + d.product + " is currently priced at **₹" + d.price + "** down from the regular price of ₹" + d.origPrice + "." + couponText + "\n\n" +
                       "Thought I'd share for anyone tracking prices for this item.\n\n" +
                       "Link: " + d.url;
            }
        },
        {
            id: "rd_quick_bullet",
            name: "4. 📌 Clean Bulleted Summary",
            render: function(d) {
                return "**" + d.product + " @ ₹" + d.price + "**\n\n" +
                       "- **Store:** " + d.store + "\n" +
                       "- **List Price:** ₹" + d.origPrice + "\n" +
                       "- **Discount:** " + d.discount + "%\n" +
                       (d.coupon ? "- **Code:** `" + d.coupon + "`\n" : "") +
                       "- **Link:** " + d.url;
            }
        },
        {
            id: "rd_stealdeals",
            name: "5. 🔥 Steal Deal Alert",
            render: function(d) {
                return "🔥 **[STEAL DEAL] " + d.product + " at ₹" + d.price + "**\n\n" +
                       "Massive price cut on " + d.store + ". Regular price is ₹" + d.origPrice + " (" + d.discount + "% OFF).\n\n" +
                       (d.coupon ? "Use Coupon: `" + d.coupon + "`\n\n" : "") +
                       "Order before stock expires: [" + d.url + "](" + d.url + ")";
            }
        },
        {
            id: "rd_review_op",
            name: "6. 💬 OP Deal Experience",
            render: function(d) {
                return "PSA: " + d.product + " has hit ₹" + d.price + " on " + d.store + ".\n\n" +
                       "Usually hovers around ₹" + d.origPrice + ". Excellent value at " + d.discount + "% off.\n\n" +
                       (d.coupon ? "Remember to use voucher `" + d.coupon + "` at payment.\n\n" : "") +
                       "Deal Link: " + d.url;
            }
        },
        {
            id: "rd_price_history",
            name: "7. 📉 All-Time Low Tracker",
            render: function(d) {
                return "### 📉 Lowest Price Track: " + d.product + "\n\n" +
                       "* Current: **₹" + d.price + "**\n" +
                       "* MSRP: ~~₹" + d.origPrice + "~~\n" +
                       "* Off: **" + d.discount + "%**\n" +
                       "* Platform: " + d.store + "\n\n" +
                       "Check offer: [Direct Link](" + d.url + ")";
            }
        },
        {
            id: "rd_gift_recommend",
            name: "8. 🎁 Recommendation Post",
            render: function(d) {
                return "**Great price on " + d.product + " on " + d.store + "**\n\n" +
                       "If anyone is looking for " + d.product + ", it's currently on sale for ₹" + d.price + " (regularly ₹" + d.origPrice + ").\n\n" +
                       "Link: " + d.url;
            }
        },
        {
            id: "rd_minimal_post",
            name: "9. ⚡ Short & Direct",
            render: function(d) {
                return "**" + d.product + "** is on sale for **₹" + d.price + "** (" + d.discount + "% off ₹" + d.origPrice + ") on " + d.store + ".\n\n" + d.url;
            }
        },
        {
            id: "rd_voucher_loot",
            name: "10. 🎟️ Coupon + Deal Combo",
            render: function(d) {
                return "**[Coupon + Deal] " + d.product + " on " + d.store + "**\n\n" +
                       "Price: ₹" + d.price + " (Was: ₹" + d.origPrice + " - " + d.discount + "% off)\n\n" +
                       (d.coupon ? "Apply coupon code `" + d.coupon + "` at checkout.\n\n" : "") +
                       "Link: [" + d.url + "](" + d.url + ")";
            }
        }
    ]
};

// ==========================================================
// POPULATE SAVED DEALS IN DROPDOWN
// ==========================================================

function loadSavedDealsDropdown() {
    var dropdown = document.getElementById("dealSelectDropdown");
    if (!dropdown) return;

    try {
        var stored = localStorage.getItem("affiliateDeals");
        savedDeals = stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Error reading saved deals:", e);
        savedDeals = [];
    }

    dropdown.innerHTML = '<option value="">-- Choose from saved deals --</option>';

    if (savedDeals.length === 0) {
        var opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "No saved deals found (Add in Deals page)";
        opt.disabled = true;
        dropdown.appendChild(opt);
        return;
    }

    savedDeals.forEach(function(deal) {
        var opt = document.createElement("option");
        opt.value = deal.id;
        opt.textContent = deal.productName + " (₹" + deal.price + " - " + deal.store + ")";
        dropdown.appendChild(opt);
    });
}

function autoFillSelectedDeal() {
    var dropdown = document.getElementById("dealSelectDropdown");
    if (!dropdown || !dropdown.value) {
        alert("Please select a deal from the dropdown first.");
        return;
    }

    var deal = savedDeals.find(function(d) {
        return d.id === dropdown.value;
    });

    if (!deal) return;

    document.getElementById("contentProductName").value = deal.productName || "";
    document.getElementById("contentStore").value = deal.store || "";
    document.getElementById("contentPrice").value = deal.price != null ? deal.price : "";
    document.getElementById("contentOriginalPrice").value = deal.originalPrice != null ? deal.originalPrice : "";
    document.getElementById("contentCoupon").value = deal.coupon || "";
    document.getElementById("contentUrl").value = deal.productUrl || "";
}

// ==========================================================
// TEMPLATE SELECTION LOGIC
// ==========================================================

function updateTemplateOptions() {
    var platformSelect = document.getElementById("platformSelect");
    var templateSelect = document.getElementById("templateSelect");
    if (!platformSelect || !templateSelect) return;

    var platform = platformSelect.value;
    var templates = TEMPLATES[platform] || [];

    templateSelect.innerHTML = "";
    templates.forEach(function(t) {
        var opt = document.createElement("option");
        opt.value = t.id;
        opt.textContent = t.name;
        templateSelect.appendChild(opt);
    });
}

// ==========================================================
// CONTENT GENERATION
// ==========================================================

function generateContentCopy() {
    var product = document.getElementById("contentProductName").value.trim() || "Featured Product";
    var store = document.getElementById("contentStore").value.trim() || "Online Store";
    var price = document.getElementById("contentPrice").value.trim() || "0";
    var origPrice = document.getElementById("contentOriginalPrice").value.trim() || price;
    var coupon = document.getElementById("contentCoupon").value.trim();
    var url = document.getElementById("contentUrl").value.trim() || "https://your-affiliate-link.com";

    var platform = document.getElementById("platformSelect").value;
    var templateId = document.getElementById("templateSelect").value;

    var discount = 0;
    var numPrice = Number(price);
    var numOrig = Number(origPrice);
    if (numOrig > 0 && numPrice >= 0 && numOrig > numPrice) {
        discount = Math.round(((numOrig - numPrice) / numOrig) * 100);
    }

    var dealData = {
        product: product,
        store: store,
        price: price,
        origPrice: origPrice,
        discount: discount,
        coupon: coupon,
        url: url
    };

    var platformTemplates = TEMPLATES[platform] || [];
    var template = platformTemplates.find(function(t) {
        return t.id === templateId;
    }) || platformTemplates[0];

    var outputTextarea = document.getElementById("generatedContent");
    if (outputTextarea && template) {
        outputTextarea.value = template.render(dealData);
    }
}

// ==========================================================
// CLIPBOARD COPY
// ==========================================================

async function copyContent() {
    var outputTextarea = document.getElementById("generatedContent");
    var copyBtn = document.getElementById("copyContent");

    if (!outputTextarea || !outputTextarea.value.trim()) {
        alert("Nothing to copy! Click 'Generate Social Copy' first.");
        return;
    }

    try {
        await navigator.clipboard.writeText(outputTextarea.value);
        copyBtn.textContent = "✅ Copied!";
        setTimeout(function() {
            copyBtn.textContent = "📋 Copy to Clipboard";
        }, 2000);
    } catch (err) {
        outputTextarea.select();
        document.execCommand("copy");
        alert("Copied to clipboard!");
    }
}

// ==========================================================
// INITIALIZATION
// ==========================================================

function initContentStudio() {
    loadSavedDealsDropdown();
    updateTemplateOptions();

    var fetchBtn = document.getElementById("btnFetchDeal");
    if (fetchBtn) fetchBtn.addEventListener("click", autoFillSelectedDeal);

    var dealDropdown = document.getElementById("dealSelectDropdown");
    if (dealDropdown) dealDropdown.addEventListener("change", autoFillSelectedDeal);

    var platformSelect = document.getElementById("platformSelect");
    if (platformSelect) platformSelect.addEventListener("change", updateTemplateOptions);

    var generateBtn = document.getElementById("generateContent");
    if (generateBtn) generateBtn.addEventListener("click", generateContentCopy);

    var copyBtn = document.getElementById("copyContent");
    if (copyBtn) copyBtn.addEventListener("click", copyContent);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initContentStudio);
} else {
    initContentStudio();
}
