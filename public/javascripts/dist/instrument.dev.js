"use strict";

function Instrument(name, wave_name, attack, decay, sustain, release, gain, filter, reverb, delay) {
  this.name = name;
  var synth = new Tone.PolySynth();
  synth.set({
    oscillator: {
      type: wave_name
    },
    envelope: {
      attack: attack,
      decay: decay,
      decayCurve: "linear",
      sustain: sustain,
      release: release,
      releaseCurve: "linear"
    }
  });
  this.synth = synth;
  this.cutoff = 1500;
  this.filter_type = "lowpass";
  this.decay = 1;
  this.reverb_wet = 1;
  this.time = [1, 8];
  this.feedback = 0.5;
  this.delay_wet = 1;

  if (filter != null) {
    this.filter = new Tone.Filter({
      frequency: filter.cutoff,
      type: filter.type
    });
    this.cutoff = filter.cutoff;
    this.filter_type = filter.type;
  } else {
    this.filter = null;
  }

  if (reverb != null) {
    this.reverb = new Tone.Reverb({
      decay: reverb.decay,
      wet: reverb.wet
    });
    this.decay = reverb.decay;
    this.reverb_wet = reverb.wet;
  } else {
    this.reverb = null;
  }

  if (delay != null) {
    var time = delay.time[0] / delay.time[1] * secPerBeat;
    this.delay = new Tone.FeedbackDelay({
      delayTime: time,
      feedback: delay.feedback,
      wet: delay.wet
    });
    this.time = delay.time;
    this.feedback = delay.feedback;
    this.delay_wet = delay.wet;
  } else {
    this.delay = null;
  }

  this.gain = new Tone.Gain(gain).toDestination();
  this.key_map = new Map();

  this.rebuild = function () {
    this.synth.disconnect();
    var effects_list = [];

    if (this.filter != null) {
      this.filter.disconnect();
      effects_list.push(this.filter);
    }

    if (this.reverb != null) {
      this.reverb.disconnect();
      effects_list.push(this.reverb);
    }

    if (this.delay != null) {
      this.delay.disconnect();
      this.delay.set({
        delayTime: this.time[0] / this.time[1] * secPerBeat
      });
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

  this.set_name = function (name) {
    this.name = name;
  };

  this.set_wave_form = function (wave_form) {
    this.synth.set({
      oscillator: {
        type: wave_form
      }
    });
  };

  this.set_attack = function (attack) {
    this.synth.set({
      envelope: {
        attack: attack
      }
    });
  };

  this.set_decay = function (decay) {
    this.synth.set({
      envelope: {
        decay: decay
      }
    });
  };

  this.set_sustain = function (sustain) {
    this.synth.set({
      envelope: {
        sustain: sustain
      }
    });
  }, this.set_release = function (release) {
    this.synth.set({
      envelope: {
        release: release
      }
    });
  };

  this.set_gain = function (gain) {
    this.gain.set({
      gain: gain
    });
  };

  this.set_filter_cutoff = function (cutoff) {
    this.filter.set({
      fredquency: cutoff
    });
    this.cutoff = cutoff;
  };

  this.set_filter_type = function (type) {
    this.filter.set({
      type: type
    });
    this.filter_type = type;
  };

  this.set_reverb_decay = function (decay) {
    this.reverb.set({
      decay: decay
    });
    this.decay = decay;
  };

  this.set_reverb_mix = function (mix) {
    this.reverb.set({
      wet: mix
    });
    this.reverb_wet = mix;
  };

  this.set_delay_time = function (time) {
    this.time = time;
    this.delay.set({
      delayTime: this.time[0] / this.time[1] * secPerBeat
    });
  };

  this.set_delay_time_top = function (num) {
    this.time[0] = num;
    this.delay.set({
      delayTime: this.time[0] / this.time[1] * secPerBeat
    });
  };

  this.set_delay_time_bot = function (num) {
    this.time[1] = num;
    this.delay.set({
      delayTime: this.time[0] / this.time[1] * secPerBeat
    });
  };

  this.set_delay_feedback = function (feedback) {
    this.delay.set({
      feedback: feedback
    });
    this.feedback = feedback;
  };

  this.set_delay_mix = function (mix) {
    this.delay.set({
      wet: mix
    });
    this.delay_wet = mix;
  };

  this.get_name = function () {
    return this.name;
  };

  this.get_wave_form = function () {
    return this.synth.get().oscillator.type;
  };

  this.get_envelope = function () {
    return this.synth.get().envelope;
  }, this.get_gain = function () {
    return this.gain.get().gain;
  };

  this.get_filter_cutoff = function () {
    return this.filter.get().cutoff;
  };

  this.get_filter_type = function () {
    return this.filter.get().type;
  };

  this.get_reverb_decay = function () {
    return this.reverb.get().decay;
  };

  this.get_reverb_mix = function () {
    return this.reverb.get().wet;
  };

  this.get_delay_time = function () {
    return this.delayTime;
  };

  this.get_delay_feedback = function () {
    return this.delay.get().feedback;
  };

  this.toggle_filter = function () {
    if (this.filter != null) {
      this.filter = null;
    } else {
      this.filter = new Tone.Filter({
        frequency: this.cutoff,
        type: this.filter_type
      });
    }

    this.rebuild();
  };

  this.toggle_reverb = function () {
    if (this.reverb != null) {
      this.reverb = null;
    } else {
      this.reverb = new Tone.Reverb({
        decay: this.decay,
        wet: this.reverb_wet
      });
    }

    this.rebuild();
  };

  this.toggle_delay = function () {
    if (this.delay != null) {
      this.delay = null;
    } else {
      this.delay = new Tone.FeedbackDelay({
        delayTime: this.time[0] / this.time[1] * secPerBeat,
        feedback: this.feedback,
        wet: this.delay_wet
      });
    }

    this.rebuild();
  };

  this.filter_enabled = function () {
    if (this.filter != null) {
      return true;
    } else {
      return false;
    }
  };

  this.reverb_enabled = function () {
    if (this.reverb != null) {
      return true;
    } else {
      return false;
    }
  };

  this.delay_enabled = function () {
    if (this.delay != null) {
      return true;
    } else {
      return false;
    }
  };

  this.press_note = function (key, id) {
    if (this.key_map.has(key)) {
      this.synth.triggerRelease([key]);
    }

    this.key_map.set(key, id);
    this.synth.triggerAttack([key]);
  }, this.release_note = function (key, id) {
    if (this.key_map.get(key) != id) {} else {
      this.key_map["delete"](key);
      this.synth.triggerRelease([key]);
    }
  };
}

function Filter(cutoff, type, wet) {
  this.cutoff = cutoff;
  this.type = type;
  this.wet = wet;
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