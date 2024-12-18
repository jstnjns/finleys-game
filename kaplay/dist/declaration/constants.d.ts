export declare const ASCII_CHARS = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
export declare const DEF_ANCHOR = "topleft";
export declare const BG_GRID_SIZE = 64;
export declare const DEF_FONT = "monospace";
export declare const DBG_FONT = "monospace";
export declare const DEF_TEXT_SIZE = 36;
export declare const DEF_TEXT_CACHE_SIZE = 64;
export declare const MAX_TEXT_CACHE_SIZE = 256;
export declare const FONT_ATLAS_WIDTH = 2048;
export declare const FONT_ATLAS_HEIGHT = 2048;
export declare const SPRITE_ATLAS_WIDTH = 2048;
export declare const SPRITE_ATLAS_HEIGHT = 2048;
export declare const UV_PAD = 0.1;
export declare const DEF_HASH_GRID_SIZE = 64;
export declare const DEF_FONT_FILTER = "linear";
export declare const LOG_MAX = 8;
export declare const LOG_TIME = 4;
export declare const VERTEX_FORMAT: {
    name: string;
    size: number;
}[];
export declare const MAX_BATCHED_VERTS: number;
export declare const MAX_BATCHED_INDICES: number;
export declare const VERT_TEMPLATE = "\nattribute vec2 a_pos;\nattribute vec2 a_uv;\nattribute vec4 a_color;\n\nvarying vec2 v_pos;\nvarying vec2 v_uv;\nvarying vec4 v_color;\n\nvec4 def_vert() {\n\treturn vec4(a_pos, 0.0, 1.0);\n}\n\n{{user}}\n\nvoid main() {\n\tvec4 pos = vert(a_pos, a_uv, a_color);\n\tv_pos = a_pos;\n\tv_uv = a_uv;\n\tv_color = a_color;\n\tgl_Position = pos;\n}\n";
export declare const FRAG_TEMPLATE = "\nprecision mediump float;\n\nvarying vec2 v_pos;\nvarying vec2 v_uv;\nvarying vec4 v_color;\n\nuniform sampler2D u_tex;\n\nvec4 def_frag() {\n\treturn v_color * texture2D(u_tex, v_uv);\n}\n\n{{user}}\n\nvoid main() {\n\tgl_FragColor = frag(v_pos, v_uv, v_color, u_tex);\n\tif (gl_FragColor.a == 0.0) {\n\t\tdiscard;\n\t}\n}\n";
export declare const DEF_VERT = "\nvec4 vert(vec2 pos, vec2 uv, vec4 color) {\n\treturn def_vert();\n}\n";
export declare const DEF_FRAG = "\nvec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {\n\treturn def_frag();\n}\n";
export declare const COMP_DESC: Set<string>;
export declare const COMP_EVENTS: Set<string>;
export declare const MULTI_WORD_RE: RegExp;
export declare const DEF_OFFSCREEN_DIS = 200;
export declare const DEF_JUMP_FORCE = 640;
export declare const MAX_VEL = 65536;
//# sourceMappingURL=constants.d.ts.map