const attackAnimations = {
    tackle: function(monster, target) {
        gsap.killTweensOf(monster);
        gsap.killTweensOf(target);
        const tl = gsap.timeline();
        tl.to(monster, {
            x: monster.x - 20, duration: 0.5
        } ).to(monster, {
            x: monster.x + 40, duration: 0.2
        }).to(monster, {
            x: monster.x, duration: 0.3
        }).to(target, {
            x: target.x - 5, duration: 0.1
        }).to(target, {
            x: target.x + 5,  duration: 0.1
        }).to(target, {
            x: target.x - 5 , duration: 0.1
        }).to(target, {
            x: target.x + 5,  duration: 0.1
        }).to(target, {
            x: target.x - 5 , duration: 0.1
        }).to(target, {
            x: target.x + 5,  duration: 0.1
        }).to(target, {
            x: target.x, duration: 0.1
        });
    },

    burn: function(monster, target){
        gsap.killTweensOf(monster);
        gsap.killTweensOf(target);
        const tl = gsap.timeline();
        
    },
    "fire tornado": function(monster, target){
        gsap.killTweensOf(monster);
        gsap.killTweensOf(target);
        const tl = gsap.timeline();
        tl.to(monster, {
            
        })
    },
    "lava shell": function(monster, target){
        gsap.killTweensOf(monster);
        gsap.killTweensOf(target);
        const tl = gsap.timeline();
        tl.to(monster, {
            
        } )
    }

}