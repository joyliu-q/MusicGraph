function Instrument(wave_name, attack, decay, sustain, release, gain, filter, reverb, delay) {
    let synth = new Tone.PolySynth();
    synth.set({oscillator: {type: wave_name}, envelope: {attack: attack, decay: decay, decayCurve: "linear", sustain: sustain, release: release, releaseCurve: "linear"}})
    this.synth = synth;
    if (filter != null) {
        this.filter = new Tone.Filter({frequency: filter.cutoff, type: filter.type});
    } else {
        this.filter = null;
    }
    if (reverb != null) {
        this.reverb = new Tone.Reverb({decay: reverb.decay, wet: reverb.wet});
    } else {
        this.reverb = null;
    }
    if (delay != null) {
        this.delay = new Tone.FeedbackDelay({delayTime: delay.time, feedback: delay.feedback, wet: delay.wet});
    } else {
        this.delay = null;
    }
    this.gain = new Tone.Gain(gain).toDestination();
    this.key_map = new Map();
    this.rebuild = function() {
        let effects_list = [];
        if (filter != null) {
            effects_list.push(this.filter);
        }
        if (reverb != null) {
            effects_list.push(this.reverb);
        }
        if (delay != null) {
            effects_list.push(this.delay);
        }
        if (effects_list.length > 0) {
            this.synth.connect(effects_list[0]);
            for (i = 0; i < effects_list.length - 1; i++) {
                effects_list[i].connect(effects_list[i + 1]);
            }
            effects_list[effects_list.length - 1].connect(this.gain);
        } else {
            this.synth.connect(this.gain);
        }
    };
    this.rebuild();
    this.set_wave_form = function(wave_form) {
        this.synth.set({oscillator: {type: wave_form}});
    };
    this.set_attack = function(attack) {
        this.synth.set({envelope: {attack: attack}});
    };
    this.set_decay = function(decay) {
        this.synth.set({envelope: {decay: decay}});
    };
    this.set_sustain = function(sustain) {
        this.synth.set({envelope: {sustain: sustain}});
    },
    this.set_release = function(release) {
        this.synth.set({envelope: {release: release}});
    };
    this.set_gain = function(gain) {
        this.gain.set({gain: gain});
    };
    this.set_filter_cutoff = function(cutoff) {
        this.filter.set({cutoff: cutoff});
    };
    this.set_filter_type = function(type) {
        this.filter.set({type: type});
    };
    this.set_reverb_decay = function(decay) {
        this.reverb.set({decay: decay});
    };
    this.set_reverb_mix = function(mix) {
        this.reverb.set({wet: mix});
    };
    this.set_delay_time = function(time) {
        this.delay.set({time: time});
    };
    this.set_delay_feedback = function(feedback) {
        this.delay.set({feedback: feedback});
    };

    this.get_wave_form = function() {
        return this.synth.get().oscillator.type;
    };
    this.get_envelope = function() {
        return this.synth.get().envelope;
    },
    this.get_gain = function() {
        return this.gain.get().gain;
    };
    this.get_filter_cutoff = function() {
        return this.filter.get().cutoff;
    };
    this.get_filter_type = function() {
        return this.filter.get().type;
    };
    this.get_reverb_decay = function() {
        return this.reverb.get().decay;
    };
    this.get_reverb_mix = function() {
        return this.reverb.get().wet;
    };
    this.get_delay_time = function() {
        return this.delay.get().time;
    };
    this.get_delay_feedback = function() {
        return this.delay.get().feedback;
    };

    this.press_note = function(key, id) {
        if (this.key_map.has(key)) {
            this.synth.triggerRelease([key]);
        }
        this.key_map.set(key, id);
        this.synth.triggerAttack([key]);
    },
    this.release_note = function(key, id) {
        if (this.key_map.get(key) != id) {
        } else {
            this.key_map.delete(key);
            this.synth.triggerRelease([key]);
        }
    }
}

function Filter(cutoff, type) {
    this.cutoff = cutoff;
    this.type = type;
}

function Reverb(decay, wet) {
    this.decay = decay;
    this.wet = wet;
}

function Delay(time, feedback, wet) {
    this.time = time;
    this.feedback = feedback;
    this.wet = wet;
}