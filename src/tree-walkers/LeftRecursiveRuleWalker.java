// $ANTLR 3.5.3 org/antlr/v4/parse/LeftRecursiveRuleWalker.g

package org.antlr.v4.parse;

import org.antlr.v4.misc.*;
import org.antlr.v4.tool.*;
import org.antlr.v4.tool.ast.*;


import org.antlr.runtime.*;
import org.antlr.runtime.tree.*;
import java.util.Stack;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

/** Find left-recursive rules */
@SuppressWarnings("all")
public class LeftRecursiveRuleWalker extends TreeParser {
	public static final String[] tokenNames = new String[] {
		"<invalid>", "<EOR>", "<DOWN>", "<UP>", "ACTION", "ACTION_CHAR_LITERAL", 
		"ACTION_ESC", "ACTION_STRING_LITERAL", "ARG_ACTION", "ARG_OR_CHARSET", 
		"ASSIGN", "AT", "CATCH", "CHANNELS", "COLON", "COLONCOLON", "COMMA", "COMMENT", 
		"DOC_COMMENT", "DOLLAR", "DOT", "ERRCHAR", "ESC_SEQ", "FINALLY", "FRAGMENT", 
		"GRAMMAR", "GT", "HEX_DIGIT", "ID", "IMPORT", "INT", "LEXER", "LEXER_CHAR_SET", 
		"LOCALS", "LPAREN", "LT", "MODE", "NESTED_ACTION", "NLCHARS", "NOT", "NameChar", 
		"NameStartChar", "OPTIONS", "OR", "PARSER", "PLUS", "PLUS_ASSIGN", "POUND", 
		"QUESTION", "RANGE", "RARROW", "RBRACE", "RETURNS", "RPAREN", "RULE_REF", 
		"SEMI", "SEMPRED", "SRC", "STAR", "STRING_LITERAL", "THROWS", "TOKENS_SPEC", 
		"TOKEN_REF", "UNICODE_ESC", "UNICODE_EXTENDED_ESC", "UnicodeBOM", "WS", 
		"WSCHARS", "WSNLCHARS", "ALT", "BLOCK", "CLOSURE", "COMBINED", "ELEMENT_OPTIONS", 
		"EPSILON", "LEXER_ACTION_CALL", "LEXER_ALT_ACTION", "OPTIONAL", "POSITIVE_CLOSURE", 
		"RULE", "RULEMODIFIERS", "RULES", "SET", "WILDCARD", "PRIVATE", "PROTECTED", 
		"PUBLIC"
	};
	public static final int EOF=-1;
	public static final int ACTION=4;
	public static final int ACTION_CHAR_LITERAL=5;
	public static final int ACTION_ESC=6;
	public static final int ACTION_STRING_LITERAL=7;
	public static final int ARG_ACTION=8;
	public static final int ARG_OR_CHARSET=9;
	public static final int ASSIGN=10;
	public static final int AT=11;
	public static final int CATCH=12;
	public static final int CHANNELS=13;
	public static final int COLON=14;
	public static final int COLONCOLON=15;
	public static final int COMMA=16;
	public static final int COMMENT=17;
	public static final int DOC_COMMENT=18;
	public static final int DOLLAR=19;
	public static final int DOT=20;
	public static final int ERRCHAR=21;
	public static final int ESC_SEQ=22;
	public static final int FINALLY=23;
	public static final int FRAGMENT=24;
	public static final int GRAMMAR=25;
	public static final int GT=26;
	public static final int HEX_DIGIT=27;
	public static final int ID=28;
	public static final int IMPORT=29;
	public static final int INT=30;
	public static final int LEXER=31;
	public static final int LEXER_CHAR_SET=32;
	public static final int LOCALS=33;
	public static final int LPAREN=34;
	public static final int LT=35;
	public static final int MODE=36;
	public static final int NESTED_ACTION=37;
	public static final int NLCHARS=38;
	public static final int NOT=39;
	public static final int NameChar=40;
	public static final int NameStartChar=41;
	public static final int OPTIONS=42;
	public static final int OR=43;
	public static final int PARSER=44;
	public static final int PLUS=45;
	public static final int PLUS_ASSIGN=46;
	public static final int POUND=47;
	public static final int QUESTION=48;
	public static final int RANGE=49;
	public static final int RARROW=50;
	public static final int RBRACE=51;
	public static final int RETURNS=52;
	public static final int RPAREN=53;
	public static final int RULE_REF=54;
	public static final int SEMI=55;
	public static final int SEMPRED=56;
	public static final int SRC=57;
	public static final int STAR=58;
	public static final int STRING_LITERAL=59;
	public static final int THROWS=60;
	public static final int TOKENS_SPEC=61;
	public static final int TOKEN_REF=62;
	public static final int UNICODE_ESC=63;
	public static final int UNICODE_EXTENDED_ESC=64;
	public static final int UnicodeBOM=65;
	public static final int WS=66;
	public static final int WSCHARS=67;
	public static final int WSNLCHARS=68;
	public static final int ALT=69;
	public static final int BLOCK=70;
	public static final int CLOSURE=71;
	public static final int COMBINED=72;
	public static final int ELEMENT_OPTIONS=73;
	public static final int EPSILON=74;
	public static final int LEXER_ACTION_CALL=75;
	public static final int LEXER_ALT_ACTION=76;
	public static final int OPTIONAL=77;
	public static final int POSITIVE_CLOSURE=78;
	public static final int RULE=79;
	public static final int RULEMODIFIERS=80;
	public static final int RULES=81;
	public static final int SET=82;
	public static final int WILDCARD=83;
	public static final int PRIVATE=84;
	public static final int PROTECTED=85;
	public static final int PUBLIC=86;

	// delegates
	public TreeParser[] getDelegates() {
		return new TreeParser[] {};
	}

	// delegators


	public LeftRecursiveRuleWalker(TreeNodeStream input) {
		this(input, new RecognizerSharedState());
	}
	public LeftRecursiveRuleWalker(TreeNodeStream input, RecognizerSharedState state) {
		super(input, state);
	}

	@Override public String[] getTokenNames() { return LeftRecursiveRuleWalker.tokenNames; }
	@Override public String getGrammarFileName() { return "org/antlr/v4/parse/LeftRecursiveRuleWalker.g"; }


	private String ruleName;
	private int currentOuterAltNumber; // which outer alt of rule?
	public int numAlts;  // how many alts for this rule total?

	public void setAltAssoc(AltAST altTree, int alt) {}
	public void binaryAlt(AltAST altTree, int alt) {}
	public void prefixAlt(AltAST altTree, int alt) {}
	public void suffixAlt(AltAST altTree, int alt) {}
	public void otherAlt(AltAST altTree, int alt) {}
	public void setReturnValues(GrammarAST t) {}



	// $ANTLR start "rec_rule"
	// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:64:1: public rec_rule returns [boolean isLeftRec] : ^(r= RULE id= RULE_REF ( ruleModifier )? ( ^( RETURNS a= ARG_ACTION ) )? ( ^( LOCALS ARG_ACTION ) )? ( ^( OPTIONS ( . )* ) | ^( AT ID ACTION ) )* ruleBlock exceptionGroup ) ;
	public final boolean rec_rule() throws RecognitionException {
		boolean isLeftRec = false;


		GrammarAST r=null;
		GrammarAST id=null;
		GrammarAST a=null;
		TreeRuleReturnScope ruleBlock1 =null;


			currentOuterAltNumber = 1;

		try {
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:69:2: ( ^(r= RULE id= RULE_REF ( ruleModifier )? ( ^( RETURNS a= ARG_ACTION ) )? ( ^( LOCALS ARG_ACTION ) )? ( ^( OPTIONS ( . )* ) | ^( AT ID ACTION ) )* ruleBlock exceptionGroup ) )
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:69:4: ^(r= RULE id= RULE_REF ( ruleModifier )? ( ^( RETURNS a= ARG_ACTION ) )? ( ^( LOCALS ARG_ACTION ) )? ( ^( OPTIONS ( . )* ) | ^( AT ID ACTION ) )* ruleBlock exceptionGroup )
			{
			r=(GrammarAST)match(input,RULE,FOLLOW_RULE_in_rec_rule72); if (state.failed) return isLeftRec;
			match(input, Token.DOWN, null); if (state.failed) return isLeftRec;
			id=(GrammarAST)match(input,RULE_REF,FOLLOW_RULE_REF_in_rec_rule76); if (state.failed) return isLeftRec;
			if ( state.backtracking==0 ) {ruleName=id.getText();}
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:70:4: ( ruleModifier )?
			int alt1=2;
			int LA1_0 = input.LA(1);
			if ( ((LA1_0 >= PRIVATE && LA1_0 <= PUBLIC)) ) {
				alt1=1;
			}
			switch (alt1) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:70:4: ruleModifier
					{
					pushFollow(FOLLOW_ruleModifier_in_rec_rule83);
					ruleModifier();
					state._fsp--;
					if (state.failed) return isLeftRec;
					}
					break;

			}

			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:72:4: ( ^( RETURNS a= ARG_ACTION ) )?
			int alt2=2;
			int LA2_0 = input.LA(1);
			if ( (LA2_0==RETURNS) ) {
				alt2=1;
			}
			switch (alt2) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:72:5: ^( RETURNS a= ARG_ACTION )
					{
					match(input,RETURNS,FOLLOW_RETURNS_in_rec_rule92); if (state.failed) return isLeftRec;
					match(input, Token.DOWN, null); if (state.failed) return isLeftRec;
					a=(GrammarAST)match(input,ARG_ACTION,FOLLOW_ARG_ACTION_in_rec_rule96); if (state.failed) return isLeftRec;
					if ( state.backtracking==0 ) {setReturnValues(a);}
					match(input, Token.UP, null); if (state.failed) return isLeftRec;

					}
					break;

			}

			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:74:9: ( ^( LOCALS ARG_ACTION ) )?
			int alt3=2;
			int LA3_0 = input.LA(1);
			if ( (LA3_0==LOCALS) ) {
				alt3=1;
			}
			switch (alt3) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:74:11: ^( LOCALS ARG_ACTION )
					{
					match(input,LOCALS,FOLLOW_LOCALS_in_rec_rule115); if (state.failed) return isLeftRec;
					match(input, Token.DOWN, null); if (state.failed) return isLeftRec;
					match(input,ARG_ACTION,FOLLOW_ARG_ACTION_in_rec_rule117); if (state.failed) return isLeftRec;
					match(input, Token.UP, null); if (state.failed) return isLeftRec;

					}
					break;

			}

			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:75:9: ( ^( OPTIONS ( . )* ) | ^( AT ID ACTION ) )*
			loop5:
			while (true) {
				int alt5=3;
				int LA5_0 = input.LA(1);
				if ( (LA5_0==OPTIONS) ) {
					alt5=1;
				}
				else if ( (LA5_0==AT) ) {
					alt5=2;
				}

				switch (alt5) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:75:11: ^( OPTIONS ( . )* )
					{
					match(input,OPTIONS,FOLLOW_OPTIONS_in_rec_rule135); if (state.failed) return isLeftRec;
					if ( input.LA(1)==Token.DOWN ) {
						match(input, Token.DOWN, null); if (state.failed) return isLeftRec;
						// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:75:21: ( . )*
						loop4:
						while (true) {
							int alt4=2;
							int LA4_0 = input.LA(1);
							if ( ((LA4_0 >= ACTION && LA4_0 <= PUBLIC)) ) {
								alt4=1;
							}
							else if ( (LA4_0==UP) ) {
								alt4=2;
							}

							switch (alt4) {
							case 1 :
								// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:75:21: .
								{
								matchAny(input); if (state.failed) return isLeftRec;
								}
								break;

							default :
								break loop4;
							}
						}

						match(input, Token.UP, null); if (state.failed) return isLeftRec;
					}

					}
					break;
				case 2 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:76:11: ^( AT ID ACTION )
					{
					match(input,AT,FOLLOW_AT_in_rec_rule152); if (state.failed) return isLeftRec;
					match(input, Token.DOWN, null); if (state.failed) return isLeftRec;
					match(input,ID,FOLLOW_ID_in_rec_rule154); if (state.failed) return isLeftRec;
					match(input,ACTION,FOLLOW_ACTION_in_rec_rule156); if (state.failed) return isLeftRec;
					match(input, Token.UP, null); if (state.failed) return isLeftRec;

					}
					break;

				default :
					break loop5;
				}
			}

			pushFollow(FOLLOW_ruleBlock_in_rec_rule172);
			ruleBlock1=ruleBlock();
			state._fsp--;
			if (state.failed) return isLeftRec;
			if ( state.backtracking==0 ) {isLeftRec = (ruleBlock1!=null?((LeftRecursiveRuleWalker.ruleBlock_return)ruleBlock1).isLeftRec:false);}
			pushFollow(FOLLOW_exceptionGroup_in_rec_rule179);
			exceptionGroup();
			state._fsp--;
			if (state.failed) return isLeftRec;
			match(input, Token.UP, null); if (state.failed) return isLeftRec;

			}

		}
		 
		finally {
			// do for sure before leaving
		}
		return isLeftRec;
	}
	// $ANTLR end "rec_rule"



	// $ANTLR start "exceptionGroup"
	// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:83:1: exceptionGroup : ( exceptionHandler )* ( finallyClause )? ;
	public final void exceptionGroup() throws RecognitionException {
		try {
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:84:5: ( ( exceptionHandler )* ( finallyClause )? )
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:84:7: ( exceptionHandler )* ( finallyClause )?
			{
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:84:7: ( exceptionHandler )*
			loop6:
			while (true) {
				int alt6=2;
				int LA6_0 = input.LA(1);
				if ( (LA6_0==CATCH) ) {
					alt6=1;
				}

				switch (alt6) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:84:7: exceptionHandler
					{
					pushFollow(FOLLOW_exceptionHandler_in_exceptionGroup197);
					exceptionHandler();
					state._fsp--;
					if (state.failed) return;
					}
					break;

				default :
					break loop6;
				}
			}

			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:84:25: ( finallyClause )?
			int alt7=2;
			int LA7_0 = input.LA(1);
			if ( (LA7_0==FINALLY) ) {
				alt7=1;
			}
			switch (alt7) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:84:25: finallyClause
					{
					pushFollow(FOLLOW_finallyClause_in_exceptionGroup200);
					finallyClause();
					state._fsp--;
					if (state.failed) return;
					}
					break;

			}

			}

		}
		 
		finally {
			// do for sure before leaving
		}
	}
	// $ANTLR end "exceptionGroup"



	// $ANTLR start "exceptionHandler"
	// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:87:1: exceptionHandler : ^( CATCH ARG_ACTION ACTION ) ;
	public final void exceptionHandler() throws RecognitionException {
		try {
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:88:2: ( ^( CATCH ARG_ACTION ACTION ) )
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:88:4: ^( CATCH ARG_ACTION ACTION )
			{
			match(input,CATCH,FOLLOW_CATCH_in_exceptionHandler216); if (state.failed) return;
			match(input, Token.DOWN, null); if (state.failed) return;
			match(input,ARG_ACTION,FOLLOW_ARG_ACTION_in_exceptionHandler218); if (state.failed) return;
			match(input,ACTION,FOLLOW_ACTION_in_exceptionHandler220); if (state.failed) return;
			match(input, Token.UP, null); if (state.failed) return;

			}

		}
		 
		finally {
			// do for sure before leaving
		}
	}
	// $ANTLR end "exceptionHandler"



	// $ANTLR start "finallyClause"
	// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:91:1: finallyClause : ^( FINALLY ACTION ) ;
	public final void finallyClause() throws RecognitionException {
		try {
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:92:2: ( ^( FINALLY ACTION ) )
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:92:4: ^( FINALLY ACTION )
			{
			match(input,FINALLY,FOLLOW_FINALLY_in_finallyClause233); if (state.failed) return;
			match(input, Token.DOWN, null); if (state.failed) return;
			match(input,ACTION,FOLLOW_ACTION_in_finallyClause235); if (state.failed) return;
			match(input, Token.UP, null); if (state.failed) return;

			}

		}
		 
		finally {
			// do for sure before leaving
		}
	}
	// $ANTLR end "finallyClause"



	// $ANTLR start "ruleModifier"
	// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:95:1: ruleModifier : ( PUBLIC | PRIVATE | PROTECTED );
	public final void ruleModifier() throws RecognitionException {
		try {
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:96:5: ( PUBLIC | PRIVATE | PROTECTED )
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:
			{
			if ( (input.LA(1) >= PRIVATE && input.LA(1) <= PUBLIC) ) {
				input.consume();
				state.errorRecovery=false;
				state.failed=false;
			}
			else {
				if (state.backtracking>0) {state.failed=true; return;}
				MismatchedSetException mse = new MismatchedSetException(null,input);
				throw mse;
			}
			}

		}
		 
		finally {
			// do for sure before leaving
		}
	}
	// $ANTLR end "ruleModifier"


	public static class ruleBlock_return extends TreeRuleReturnScope {
		public boolean isLeftRec;
	};


	// $ANTLR start "ruleBlock"
	// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:101:1: ruleBlock returns [boolean isLeftRec] : ^( BLOCK (o= outerAlternative )+ ) ;
	public final LeftRecursiveRuleWalker.ruleBlock_return ruleBlock() throws RecognitionException {
		LeftRecursiveRuleWalker.ruleBlock_return retval = new LeftRecursiveRuleWalker.ruleBlock_return();
		retval.start = input.LT(1);

		TreeRuleReturnScope o =null;

		boolean lr=false; this.numAlts = ((GrammarAST)retval.start).getChildCount();
		try {
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:103:2: ( ^( BLOCK (o= outerAlternative )+ ) )
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:103:4: ^( BLOCK (o= outerAlternative )+ )
			{
			match(input,BLOCK,FOLLOW_BLOCK_in_ruleBlock290); if (state.failed) return retval;
			match(input, Token.DOWN, null); if (state.failed) return retval;
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:104:4: (o= outerAlternative )+
			int cnt8=0;
			loop8:
			while (true) {
				int alt8=2;
				int LA8_0 = input.LA(1);
				if ( (LA8_0==ALT) ) {
					alt8=1;
				}

				switch (alt8) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:105:5: o= outerAlternative
					{
					pushFollow(FOLLOW_outerAlternative_in_ruleBlock303);
					o=outerAlternative();
					state._fsp--;
					if (state.failed) return retval;
					if ( state.backtracking==0 ) {if ((o!=null?((LeftRecursiveRuleWalker.outerAlternative_return)o).isLeftRec:false)) retval.isLeftRec = true;}
					if ( state.backtracking==0 ) {currentOuterAltNumber++;}
					}
					break;

				default :
					if ( cnt8 >= 1 ) break loop8;
					if (state.backtracking>0) {state.failed=true; return retval;}
					EarlyExitException eee = new EarlyExitException(8, input);
					throw eee;
				}
				cnt8++;
			}

			match(input, Token.UP, null); if (state.failed) return retval;

			}

		}
		 
		finally {
			// do for sure before leaving
		}
		return retval;
	}
	// $ANTLR end "ruleBlock"


	public static class outerAlternative_return extends TreeRuleReturnScope {
		public boolean isLeftRec;
	};


	// $ANTLR start "outerAlternative"
	// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:113:1: outerAlternative returns [boolean isLeftRec] : ( ( binary )=> binary | ( prefix )=> prefix | ( suffix )=> suffix | nonLeftRecur );
	public final LeftRecursiveRuleWalker.outerAlternative_return outerAlternative() throws RecognitionException {
		LeftRecursiveRuleWalker.outerAlternative_return retval = new LeftRecursiveRuleWalker.outerAlternative_return();
		retval.start = input.LT(1);

		try {
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:114:5: ( ( binary )=> binary | ( prefix )=> prefix | ( suffix )=> suffix | nonLeftRecur )
			int alt9=4;
			int LA9_0 = input.LA(1);
			if ( (LA9_0==ALT) ) {
				int LA9_1 = input.LA(2);
				if ( (synpred1_LeftRecursiveRuleWalker()) ) {
					alt9=1;
				}
				else if ( (synpred2_LeftRecursiveRuleWalker()) ) {
					alt9=2;
				}
				else if ( (synpred3_LeftRecursiveRuleWalker()) ) {
					alt9=3;
				}
				else if ( (true) ) {
					alt9=4;
				}

			}

			else {
				if (state.backtracking>0) {state.failed=true; return retval;}
				NoViableAltException nvae =
					new NoViableAltException("", 9, 0, input);
				throw nvae;
			}

			switch (alt9) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:114:9: ( binary )=> binary
					{
					pushFollow(FOLLOW_binary_in_outerAlternative362);
					binary();
					state._fsp--;
					if (state.failed) return retval;
					if ( state.backtracking==0 ) {binaryAlt((AltAST)((GrammarAST)retval.start), currentOuterAltNumber); retval.isLeftRec =true;}
					}
					break;
				case 2 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:116:9: ( prefix )=> prefix
					{
					pushFollow(FOLLOW_prefix_in_outerAlternative418);
					prefix();
					state._fsp--;
					if (state.failed) return retval;
					if ( state.backtracking==0 ) {prefixAlt((AltAST)((GrammarAST)retval.start), currentOuterAltNumber);}
					}
					break;
				case 3 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:118:9: ( suffix )=> suffix
					{
					pushFollow(FOLLOW_suffix_in_outerAlternative474);
					suffix();
					state._fsp--;
					if (state.failed) return retval;
					if ( state.backtracking==0 ) {suffixAlt((AltAST)((GrammarAST)retval.start), currentOuterAltNumber); retval.isLeftRec =true;}
					}
					break;
				case 4 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:120:9: nonLeftRecur
					{
					pushFollow(FOLLOW_nonLeftRecur_in_outerAlternative515);
					nonLeftRecur();
					state._fsp--;
					if (state.failed) return retval;
					if ( state.backtracking==0 ) {otherAlt((AltAST)((GrammarAST)retval.start),  currentOuterAltNumber);}
					}
					break;

			}
		}
		 
		finally {
			// do for sure before leaving
		}
		return retval;
	}
	// $ANTLR end "outerAlternative"



	// $ANTLR start "binary"
	// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:123:1: binary : ^( ALT ( elementOptions )? recurse ( element )* recurse ( epsilonElement )* ) ;
	public final void binary() throws RecognitionException {
		GrammarAST ALT2=null;

		try {
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:124:2: ( ^( ALT ( elementOptions )? recurse ( element )* recurse ( epsilonElement )* ) )
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:124:4: ^( ALT ( elementOptions )? recurse ( element )* recurse ( epsilonElement )* )
			{
			ALT2=(GrammarAST)match(input,ALT,FOLLOW_ALT_in_binary541); if (state.failed) return;
			match(input, Token.DOWN, null); if (state.failed) return;
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:124:11: ( elementOptions )?
			int alt10=2;
			int LA10_0 = input.LA(1);
			if ( (LA10_0==ELEMENT_OPTIONS) ) {
				alt10=1;
			}
			switch (alt10) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:124:11: elementOptions
					{
					pushFollow(FOLLOW_elementOptions_in_binary543);
					elementOptions();
					state._fsp--;
					if (state.failed) return;
					}
					break;

			}

			pushFollow(FOLLOW_recurse_in_binary546);
			recurse();
			state._fsp--;
			if (state.failed) return;
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:124:35: ( element )*
			loop11:
			while (true) {
				int alt11=2;
				alt11 = dfa11.predict(input);
				switch (alt11) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:124:35: element
					{
					pushFollow(FOLLOW_element_in_binary548);
					element();
					state._fsp--;
					if (state.failed) return;
					}
					break;

				default :
					break loop11;
				}
			}

			pushFollow(FOLLOW_recurse_in_binary551);
			recurse();
			state._fsp--;
			if (state.failed) return;
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:124:52: ( epsilonElement )*
			loop12:
			while (true) {
				int alt12=2;
				int LA12_0 = input.LA(1);
				if ( (LA12_0==ACTION||LA12_0==SEMPRED||LA12_0==EPSILON) ) {
					alt12=1;
				}

				switch (alt12) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:124:52: epsilonElement
					{
					pushFollow(FOLLOW_epsilonElement_in_binary553);
					epsilonElement();
					state._fsp--;
					if (state.failed) return;
					}
					break;

				default :
					break loop12;
				}
			}

			match(input, Token.UP, null); if (state.failed) return;

			if ( state.backtracking==0 ) {setAltAssoc((AltAST)ALT2,currentOuterAltNumber);}
			}

		}
		 
		finally {
			// do for sure before leaving
		}
	}
	// $ANTLR end "binary"



	// $ANTLR start "prefix"
	// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:128:1: prefix : ^( ALT ( elementOptions )? ( element )+ recurse ( epsilonElement )* ) ;
	public final void prefix() throws RecognitionException {
		GrammarAST ALT3=null;

		try {
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:129:2: ( ^( ALT ( elementOptions )? ( element )+ recurse ( epsilonElement )* ) )
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:129:4: ^( ALT ( elementOptions )? ( element )+ recurse ( epsilonElement )* )
			{
			ALT3=(GrammarAST)match(input,ALT,FOLLOW_ALT_in_prefix579); if (state.failed) return;
			match(input, Token.DOWN, null); if (state.failed) return;
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:129:11: ( elementOptions )?
			int alt13=2;
			int LA13_0 = input.LA(1);
			if ( (LA13_0==ELEMENT_OPTIONS) ) {
				alt13=1;
			}
			switch (alt13) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:129:11: elementOptions
					{
					pushFollow(FOLLOW_elementOptions_in_prefix581);
					elementOptions();
					state._fsp--;
					if (state.failed) return;
					}
					break;

			}

			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:130:4: ( element )+
			int cnt14=0;
			loop14:
			while (true) {
				int alt14=2;
				alt14 = dfa14.predict(input);
				switch (alt14) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:130:4: element
					{
					pushFollow(FOLLOW_element_in_prefix587);
					element();
					state._fsp--;
					if (state.failed) return;
					}
					break;

				default :
					if ( cnt14 >= 1 ) break loop14;
					if (state.backtracking>0) {state.failed=true; return;}
					EarlyExitException eee = new EarlyExitException(14, input);
					throw eee;
				}
				cnt14++;
			}

			pushFollow(FOLLOW_recurse_in_prefix593);
			recurse();
			state._fsp--;
			if (state.failed) return;
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:131:12: ( epsilonElement )*
			loop15:
			while (true) {
				int alt15=2;
				int LA15_0 = input.LA(1);
				if ( (LA15_0==ACTION||LA15_0==SEMPRED||LA15_0==EPSILON) ) {
					alt15=1;
				}

				switch (alt15) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:131:12: epsilonElement
					{
					pushFollow(FOLLOW_epsilonElement_in_prefix595);
					epsilonElement();
					state._fsp--;
					if (state.failed) return;
					}
					break;

				default :
					break loop15;
				}
			}

			match(input, Token.UP, null); if (state.failed) return;

			if ( state.backtracking==0 ) {setAltAssoc((AltAST)ALT3,currentOuterAltNumber);}
			}

		}
		 
		finally {
			// do for sure before leaving
		}
	}
	// $ANTLR end "prefix"



	// $ANTLR start "suffix"
	// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:136:1: suffix : ^( ALT ( elementOptions )? recurse ( element )+ ) ;
	public final void suffix() throws RecognitionException {
		GrammarAST ALT4=null;

		try {
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:137:5: ( ^( ALT ( elementOptions )? recurse ( element )+ ) )
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:137:9: ^( ALT ( elementOptions )? recurse ( element )+ )
			{
			ALT4=(GrammarAST)match(input,ALT,FOLLOW_ALT_in_suffix630); if (state.failed) return;
			match(input, Token.DOWN, null); if (state.failed) return;
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:137:16: ( elementOptions )?
			int alt16=2;
			int LA16_0 = input.LA(1);
			if ( (LA16_0==ELEMENT_OPTIONS) ) {
				alt16=1;
			}
			switch (alt16) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:137:16: elementOptions
					{
					pushFollow(FOLLOW_elementOptions_in_suffix632);
					elementOptions();
					state._fsp--;
					if (state.failed) return;
					}
					break;

			}

			pushFollow(FOLLOW_recurse_in_suffix635);
			recurse();
			state._fsp--;
			if (state.failed) return;
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:137:40: ( element )+
			int cnt17=0;
			loop17:
			while (true) {
				int alt17=2;
				int LA17_0 = input.LA(1);
				if ( (LA17_0==ACTION||LA17_0==ASSIGN||LA17_0==DOT||LA17_0==NOT||LA17_0==PLUS_ASSIGN||LA17_0==RANGE||LA17_0==RULE_REF||LA17_0==SEMPRED||LA17_0==STRING_LITERAL||LA17_0==TOKEN_REF||(LA17_0 >= BLOCK && LA17_0 <= CLOSURE)||LA17_0==EPSILON||(LA17_0 >= OPTIONAL && LA17_0 <= POSITIVE_CLOSURE)||(LA17_0 >= SET && LA17_0 <= WILDCARD)) ) {
					alt17=1;
				}

				switch (alt17) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:137:40: element
					{
					pushFollow(FOLLOW_element_in_suffix637);
					element();
					state._fsp--;
					if (state.failed) return;
					}
					break;

				default :
					if ( cnt17 >= 1 ) break loop17;
					if (state.backtracking>0) {state.failed=true; return;}
					EarlyExitException eee = new EarlyExitException(17, input);
					throw eee;
				}
				cnt17++;
			}

			match(input, Token.UP, null); if (state.failed) return;

			if ( state.backtracking==0 ) {setAltAssoc((AltAST)ALT4,currentOuterAltNumber);}
			}

		}
		 
		finally {
			// do for sure before leaving
		}
	}
	// $ANTLR end "suffix"



	// $ANTLR start "nonLeftRecur"
	// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:141:1: nonLeftRecur : ^( ALT ( elementOptions )? ( element )+ ) ;
	public final void nonLeftRecur() throws RecognitionException {
		try {
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:142:5: ( ^( ALT ( elementOptions )? ( element )+ ) )
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:142:9: ^( ALT ( elementOptions )? ( element )+ )
			{
			match(input,ALT,FOLLOW_ALT_in_nonLeftRecur671); if (state.failed) return;
			match(input, Token.DOWN, null); if (state.failed) return;
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:142:15: ( elementOptions )?
			int alt18=2;
			int LA18_0 = input.LA(1);
			if ( (LA18_0==ELEMENT_OPTIONS) ) {
				alt18=1;
			}
			switch (alt18) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:142:15: elementOptions
					{
					pushFollow(FOLLOW_elementOptions_in_nonLeftRecur673);
					elementOptions();
					state._fsp--;
					if (state.failed) return;
					}
					break;

			}

			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:142:31: ( element )+
			int cnt19=0;
			loop19:
			while (true) {
				int alt19=2;
				int LA19_0 = input.LA(1);
				if ( (LA19_0==ACTION||LA19_0==ASSIGN||LA19_0==DOT||LA19_0==NOT||LA19_0==PLUS_ASSIGN||LA19_0==RANGE||LA19_0==RULE_REF||LA19_0==SEMPRED||LA19_0==STRING_LITERAL||LA19_0==TOKEN_REF||(LA19_0 >= BLOCK && LA19_0 <= CLOSURE)||LA19_0==EPSILON||(LA19_0 >= OPTIONAL && LA19_0 <= POSITIVE_CLOSURE)||(LA19_0 >= SET && LA19_0 <= WILDCARD)) ) {
					alt19=1;
				}

				switch (alt19) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:142:31: element
					{
					pushFollow(FOLLOW_element_in_nonLeftRecur676);
					element();
					state._fsp--;
					if (state.failed) return;
					}
					break;

				default :
					if ( cnt19 >= 1 ) break loop19;
					if (state.backtracking>0) {state.failed=true; return;}
					EarlyExitException eee = new EarlyExitException(19, input);
					throw eee;
				}
				cnt19++;
			}

			match(input, Token.UP, null); if (state.failed) return;

			}

		}
		 
		finally {
			// do for sure before leaving
		}
	}
	// $ANTLR end "nonLeftRecur"



	// $ANTLR start "recurse"
	// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:145:1: recurse : ( ^( ASSIGN ID recurseNoLabel ) | ^( PLUS_ASSIGN ID recurseNoLabel ) | recurseNoLabel );
	public final void recurse() throws RecognitionException {
		try {
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:146:2: ( ^( ASSIGN ID recurseNoLabel ) | ^( PLUS_ASSIGN ID recurseNoLabel ) | recurseNoLabel )
			int alt20=3;
			switch ( input.LA(1) ) {
			case ASSIGN:
				{
				alt20=1;
				}
				break;
			case PLUS_ASSIGN:
				{
				alt20=2;
				}
				break;
			case RULE_REF:
				{
				alt20=3;
				}
				break;
			default:
				if (state.backtracking>0) {state.failed=true; return;}
				NoViableAltException nvae =
					new NoViableAltException("", 20, 0, input);
				throw nvae;
			}
			switch (alt20) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:146:4: ^( ASSIGN ID recurseNoLabel )
					{
					match(input,ASSIGN,FOLLOW_ASSIGN_in_recurse693); if (state.failed) return;
					match(input, Token.DOWN, null); if (state.failed) return;
					match(input,ID,FOLLOW_ID_in_recurse695); if (state.failed) return;
					pushFollow(FOLLOW_recurseNoLabel_in_recurse697);
					recurseNoLabel();
					state._fsp--;
					if (state.failed) return;
					match(input, Token.UP, null); if (state.failed) return;

					}
					break;
				case 2 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:147:4: ^( PLUS_ASSIGN ID recurseNoLabel )
					{
					match(input,PLUS_ASSIGN,FOLLOW_PLUS_ASSIGN_in_recurse704); if (state.failed) return;
					match(input, Token.DOWN, null); if (state.failed) return;
					match(input,ID,FOLLOW_ID_in_recurse706); if (state.failed) return;
					pushFollow(FOLLOW_recurseNoLabel_in_recurse708);
					recurseNoLabel();
					state._fsp--;
					if (state.failed) return;
					match(input, Token.UP, null); if (state.failed) return;

					}
					break;
				case 3 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:148:4: recurseNoLabel
					{
					pushFollow(FOLLOW_recurseNoLabel_in_recurse714);
					recurseNoLabel();
					state._fsp--;
					if (state.failed) return;
					}
					break;

			}
		}
		 
		finally {
			// do for sure before leaving
		}
	}
	// $ANTLR end "recurse"



	// $ANTLR start "recurseNoLabel"
	// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:151:1: recurseNoLabel :{...}? RULE_REF ;
	public final void recurseNoLabel() throws RecognitionException {
		try {
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:151:16: ({...}? RULE_REF )
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:151:18: {...}? RULE_REF
			{
			if ( !((((CommonTree)input.LT(1)).getText().equals(ruleName))) ) {
				if (state.backtracking>0) {state.failed=true; return;}
				throw new FailedPredicateException(input, "recurseNoLabel", "((CommonTree)input.LT(1)).getText().equals(ruleName)");
			}
			match(input,RULE_REF,FOLLOW_RULE_REF_in_recurseNoLabel726); if (state.failed) return;
			}

		}
		 
		finally {
			// do for sure before leaving
		}
	}
	// $ANTLR end "recurseNoLabel"



	// $ANTLR start "token"
	// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:153:1: token returns [GrammarAST t=null] : ( ^( ASSIGN ID s= token ) | ^( PLUS_ASSIGN ID s= token ) |b= STRING_LITERAL | ^(b= STRING_LITERAL elementOptions ) | ^(c= TOKEN_REF elementOptions ) |c= TOKEN_REF );
	public final GrammarAST token() throws RecognitionException {
		GrammarAST t = null;


		GrammarAST b=null;
		GrammarAST c=null;
		GrammarAST s =null;

		try {
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:154:2: ( ^( ASSIGN ID s= token ) | ^( PLUS_ASSIGN ID s= token ) |b= STRING_LITERAL | ^(b= STRING_LITERAL elementOptions ) | ^(c= TOKEN_REF elementOptions ) |c= TOKEN_REF )
			int alt21=6;
			switch ( input.LA(1) ) {
			case ASSIGN:
				{
				alt21=1;
				}
				break;
			case PLUS_ASSIGN:
				{
				alt21=2;
				}
				break;
			case STRING_LITERAL:
				{
				int LA21_3 = input.LA(2);
				if ( (LA21_3==DOWN) ) {
					alt21=4;
				}
				else if ( (LA21_3==UP) ) {
					alt21=3;
				}

				else {
					if (state.backtracking>0) {state.failed=true; return t;}
					int nvaeMark = input.mark();
					try {
						input.consume();
						NoViableAltException nvae =
							new NoViableAltException("", 21, 3, input);
						throw nvae;
					} finally {
						input.rewind(nvaeMark);
					}
				}

				}
				break;
			case TOKEN_REF:
				{
				int LA21_4 = input.LA(2);
				if ( (LA21_4==DOWN) ) {
					alt21=5;
				}
				else if ( (LA21_4==UP) ) {
					alt21=6;
				}

				else {
					if (state.backtracking>0) {state.failed=true; return t;}
					int nvaeMark = input.mark();
					try {
						input.consume();
						NoViableAltException nvae =
							new NoViableAltException("", 21, 4, input);
						throw nvae;
					} finally {
						input.rewind(nvaeMark);
					}
				}

				}
				break;
			default:
				if (state.backtracking>0) {state.failed=true; return t;}
				NoViableAltException nvae =
					new NoViableAltException("", 21, 0, input);
				throw nvae;
			}
			switch (alt21) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:154:4: ^( ASSIGN ID s= token )
					{
					match(input,ASSIGN,FOLLOW_ASSIGN_in_token740); if (state.failed) return t;
					match(input, Token.DOWN, null); if (state.failed) return t;
					match(input,ID,FOLLOW_ID_in_token742); if (state.failed) return t;
					pushFollow(FOLLOW_token_in_token746);
					s=token();
					state._fsp--;
					if (state.failed) return t;
					if ( state.backtracking==0 ) {t = s;}
					match(input, Token.UP, null); if (state.failed) return t;

					}
					break;
				case 2 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:155:4: ^( PLUS_ASSIGN ID s= token )
					{
					match(input,PLUS_ASSIGN,FOLLOW_PLUS_ASSIGN_in_token755); if (state.failed) return t;
					match(input, Token.DOWN, null); if (state.failed) return t;
					match(input,ID,FOLLOW_ID_in_token757); if (state.failed) return t;
					pushFollow(FOLLOW_token_in_token761);
					s=token();
					state._fsp--;
					if (state.failed) return t;
					if ( state.backtracking==0 ) {t = s;}
					match(input, Token.UP, null); if (state.failed) return t;

					}
					break;
				case 3 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:156:4: b= STRING_LITERAL
					{
					b=(GrammarAST)match(input,STRING_LITERAL,FOLLOW_STRING_LITERAL_in_token771); if (state.failed) return t;
					if ( state.backtracking==0 ) {t = b;}
					}
					break;
				case 4 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:157:7: ^(b= STRING_LITERAL elementOptions )
					{
					b=(GrammarAST)match(input,STRING_LITERAL,FOLLOW_STRING_LITERAL_in_token792); if (state.failed) return t;
					match(input, Token.DOWN, null); if (state.failed) return t;
					pushFollow(FOLLOW_elementOptions_in_token794);
					elementOptions();
					state._fsp--;
					if (state.failed) return t;
					match(input, Token.UP, null); if (state.failed) return t;

					if ( state.backtracking==0 ) {t = b;}
					}
					break;
				case 5 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:158:7: ^(c= TOKEN_REF elementOptions )
					{
					c=(GrammarAST)match(input,TOKEN_REF,FOLLOW_TOKEN_REF_in_token809); if (state.failed) return t;
					match(input, Token.DOWN, null); if (state.failed) return t;
					pushFollow(FOLLOW_elementOptions_in_token811);
					elementOptions();
					state._fsp--;
					if (state.failed) return t;
					match(input, Token.UP, null); if (state.failed) return t;

					if ( state.backtracking==0 ) {t = c;}
					}
					break;
				case 6 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:159:4: c= TOKEN_REF
					{
					c=(GrammarAST)match(input,TOKEN_REF,FOLLOW_TOKEN_REF_in_token823); if (state.failed) return t;
					if ( state.backtracking==0 ) {t = c;}
					}
					break;

			}
		}
		 
		finally {
			// do for sure before leaving
		}
		return t;
	}
	// $ANTLR end "token"



	// $ANTLR start "elementOptions"
	// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:162:1: elementOptions : ^( ELEMENT_OPTIONS ( elementOption )* ) ;
	public final void elementOptions() throws RecognitionException {
		try {
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:163:5: ( ^( ELEMENT_OPTIONS ( elementOption )* ) )
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:163:7: ^( ELEMENT_OPTIONS ( elementOption )* )
			{
			match(input,ELEMENT_OPTIONS,FOLLOW_ELEMENT_OPTIONS_in_elementOptions853); if (state.failed) return;
			if ( input.LA(1)==Token.DOWN ) {
				match(input, Token.DOWN, null); if (state.failed) return;
				// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:163:25: ( elementOption )*
				loop22:
				while (true) {
					int alt22=2;
					int LA22_0 = input.LA(1);
					if ( (LA22_0==ASSIGN||LA22_0==ID) ) {
						alt22=1;
					}

					switch (alt22) {
					case 1 :
						// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:163:25: elementOption
						{
						pushFollow(FOLLOW_elementOption_in_elementOptions855);
						elementOption();
						state._fsp--;
						if (state.failed) return;
						}
						break;

					default :
						break loop22;
					}
				}

				match(input, Token.UP, null); if (state.failed) return;
			}

			}

		}
		 
		finally {
			// do for sure before leaving
		}
	}
	// $ANTLR end "elementOptions"



	// $ANTLR start "elementOption"
	// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:166:1: elementOption : ( ID | ^( ASSIGN ID ID ) | ^( ASSIGN ID STRING_LITERAL ) | ^( ASSIGN ID ACTION ) | ^( ASSIGN ID INT ) );
	public final void elementOption() throws RecognitionException {
		try {
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:167:5: ( ID | ^( ASSIGN ID ID ) | ^( ASSIGN ID STRING_LITERAL ) | ^( ASSIGN ID ACTION ) | ^( ASSIGN ID INT ) )
			int alt23=5;
			int LA23_0 = input.LA(1);
			if ( (LA23_0==ID) ) {
				alt23=1;
			}
			else if ( (LA23_0==ASSIGN) ) {
				int LA23_2 = input.LA(2);
				if ( (LA23_2==DOWN) ) {
					int LA23_3 = input.LA(3);
					if ( (LA23_3==ID) ) {
						switch ( input.LA(4) ) {
						case ID:
							{
							alt23=2;
							}
							break;
						case STRING_LITERAL:
							{
							alt23=3;
							}
							break;
						case ACTION:
							{
							alt23=4;
							}
							break;
						case INT:
							{
							alt23=5;
							}
							break;
						default:
							if (state.backtracking>0) {state.failed=true; return;}
							int nvaeMark = input.mark();
							try {
								for (int nvaeConsume = 0; nvaeConsume < 4 - 1; nvaeConsume++) {
									input.consume();
								}
								NoViableAltException nvae =
									new NoViableAltException("", 23, 4, input);
								throw nvae;
							} finally {
								input.rewind(nvaeMark);
							}
						}
					}

					else {
						if (state.backtracking>0) {state.failed=true; return;}
						int nvaeMark = input.mark();
						try {
							for (int nvaeConsume = 0; nvaeConsume < 3 - 1; nvaeConsume++) {
								input.consume();
							}
							NoViableAltException nvae =
								new NoViableAltException("", 23, 3, input);
							throw nvae;
						} finally {
							input.rewind(nvaeMark);
						}
					}

				}

				else {
					if (state.backtracking>0) {state.failed=true; return;}
					int nvaeMark = input.mark();
					try {
						input.consume();
						NoViableAltException nvae =
							new NoViableAltException("", 23, 2, input);
						throw nvae;
					} finally {
						input.rewind(nvaeMark);
					}
				}

			}

			else {
				if (state.backtracking>0) {state.failed=true; return;}
				NoViableAltException nvae =
					new NoViableAltException("", 23, 0, input);
				throw nvae;
			}

			switch (alt23) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:167:7: ID
					{
					match(input,ID,FOLLOW_ID_in_elementOption874); if (state.failed) return;
					}
					break;
				case 2 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:168:9: ^( ASSIGN ID ID )
					{
					match(input,ASSIGN,FOLLOW_ASSIGN_in_elementOption885); if (state.failed) return;
					match(input, Token.DOWN, null); if (state.failed) return;
					match(input,ID,FOLLOW_ID_in_elementOption887); if (state.failed) return;
					match(input,ID,FOLLOW_ID_in_elementOption889); if (state.failed) return;
					match(input, Token.UP, null); if (state.failed) return;

					}
					break;
				case 3 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:169:9: ^( ASSIGN ID STRING_LITERAL )
					{
					match(input,ASSIGN,FOLLOW_ASSIGN_in_elementOption901); if (state.failed) return;
					match(input, Token.DOWN, null); if (state.failed) return;
					match(input,ID,FOLLOW_ID_in_elementOption903); if (state.failed) return;
					match(input,STRING_LITERAL,FOLLOW_STRING_LITERAL_in_elementOption905); if (state.failed) return;
					match(input, Token.UP, null); if (state.failed) return;

					}
					break;
				case 4 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:170:9: ^( ASSIGN ID ACTION )
					{
					match(input,ASSIGN,FOLLOW_ASSIGN_in_elementOption917); if (state.failed) return;
					match(input, Token.DOWN, null); if (state.failed) return;
					match(input,ID,FOLLOW_ID_in_elementOption919); if (state.failed) return;
					match(input,ACTION,FOLLOW_ACTION_in_elementOption921); if (state.failed) return;
					match(input, Token.UP, null); if (state.failed) return;

					}
					break;
				case 5 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:171:9: ^( ASSIGN ID INT )
					{
					match(input,ASSIGN,FOLLOW_ASSIGN_in_elementOption933); if (state.failed) return;
					match(input, Token.DOWN, null); if (state.failed) return;
					match(input,ID,FOLLOW_ID_in_elementOption935); if (state.failed) return;
					match(input,INT,FOLLOW_INT_in_elementOption937); if (state.failed) return;
					match(input, Token.UP, null); if (state.failed) return;

					}
					break;

			}
		}
		 
		finally {
			// do for sure before leaving
		}
	}
	// $ANTLR end "elementOption"



	// $ANTLR start "element"
	// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:174:1: element : ( atom | ^( NOT element ) | ^( RANGE atom atom ) | ^( ASSIGN ID element ) | ^( PLUS_ASSIGN ID element ) | ^( SET ( setElement )+ ) | RULE_REF | ebnf | epsilonElement );
	public final void element() throws RecognitionException {
		try {
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:175:2: ( atom | ^( NOT element ) | ^( RANGE atom atom ) | ^( ASSIGN ID element ) | ^( PLUS_ASSIGN ID element ) | ^( SET ( setElement )+ ) | RULE_REF | ebnf | epsilonElement )
			int alt25=9;
			switch ( input.LA(1) ) {
			case RULE_REF:
				{
				int LA25_1 = input.LA(2);
				if ( (LA25_1==DOWN) ) {
					alt25=1;
				}
				else if ( ((LA25_1 >= UP && LA25_1 <= ACTION)||LA25_1==ASSIGN||LA25_1==DOT||LA25_1==NOT||LA25_1==PLUS_ASSIGN||LA25_1==RANGE||LA25_1==RULE_REF||LA25_1==SEMPRED||LA25_1==STRING_LITERAL||LA25_1==TOKEN_REF||(LA25_1 >= BLOCK && LA25_1 <= CLOSURE)||LA25_1==EPSILON||(LA25_1 >= OPTIONAL && LA25_1 <= POSITIVE_CLOSURE)||(LA25_1 >= SET && LA25_1 <= WILDCARD)) ) {
					alt25=7;
				}

				else {
					if (state.backtracking>0) {state.failed=true; return;}
					int nvaeMark = input.mark();
					try {
						input.consume();
						NoViableAltException nvae =
							new NoViableAltException("", 25, 1, input);
						throw nvae;
					} finally {
						input.rewind(nvaeMark);
					}
				}

				}
				break;
			case DOT:
			case STRING_LITERAL:
			case TOKEN_REF:
			case WILDCARD:
				{
				alt25=1;
				}
				break;
			case NOT:
				{
				alt25=2;
				}
				break;
			case RANGE:
				{
				alt25=3;
				}
				break;
			case ASSIGN:
				{
				alt25=4;
				}
				break;
			case PLUS_ASSIGN:
				{
				alt25=5;
				}
				break;
			case SET:
				{
				alt25=6;
				}
				break;
			case BLOCK:
			case CLOSURE:
			case OPTIONAL:
			case POSITIVE_CLOSURE:
				{
				alt25=8;
				}
				break;
			case ACTION:
			case SEMPRED:
			case EPSILON:
				{
				alt25=9;
				}
				break;
			default:
				if (state.backtracking>0) {state.failed=true; return;}
				NoViableAltException nvae =
					new NoViableAltException("", 25, 0, input);
				throw nvae;
			}
			switch (alt25) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:175:4: atom
					{
					pushFollow(FOLLOW_atom_in_element952);
					atom();
					state._fsp--;
					if (state.failed) return;
					}
					break;
				case 2 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:176:4: ^( NOT element )
					{
					match(input,NOT,FOLLOW_NOT_in_element958); if (state.failed) return;
					match(input, Token.DOWN, null); if (state.failed) return;
					pushFollow(FOLLOW_element_in_element960);
					element();
					state._fsp--;
					if (state.failed) return;
					match(input, Token.UP, null); if (state.failed) return;

					}
					break;
				case 3 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:177:4: ^( RANGE atom atom )
					{
					match(input,RANGE,FOLLOW_RANGE_in_element967); if (state.failed) return;
					match(input, Token.DOWN, null); if (state.failed) return;
					pushFollow(FOLLOW_atom_in_element969);
					atom();
					state._fsp--;
					if (state.failed) return;
					pushFollow(FOLLOW_atom_in_element971);
					atom();
					state._fsp--;
					if (state.failed) return;
					match(input, Token.UP, null); if (state.failed) return;

					}
					break;
				case 4 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:178:4: ^( ASSIGN ID element )
					{
					match(input,ASSIGN,FOLLOW_ASSIGN_in_element978); if (state.failed) return;
					match(input, Token.DOWN, null); if (state.failed) return;
					match(input,ID,FOLLOW_ID_in_element980); if (state.failed) return;
					pushFollow(FOLLOW_element_in_element982);
					element();
					state._fsp--;
					if (state.failed) return;
					match(input, Token.UP, null); if (state.failed) return;

					}
					break;
				case 5 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:179:4: ^( PLUS_ASSIGN ID element )
					{
					match(input,PLUS_ASSIGN,FOLLOW_PLUS_ASSIGN_in_element989); if (state.failed) return;
					match(input, Token.DOWN, null); if (state.failed) return;
					match(input,ID,FOLLOW_ID_in_element991); if (state.failed) return;
					pushFollow(FOLLOW_element_in_element993);
					element();
					state._fsp--;
					if (state.failed) return;
					match(input, Token.UP, null); if (state.failed) return;

					}
					break;
				case 6 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:180:7: ^( SET ( setElement )+ )
					{
					match(input,SET,FOLLOW_SET_in_element1003); if (state.failed) return;
					match(input, Token.DOWN, null); if (state.failed) return;
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:180:13: ( setElement )+
					int cnt24=0;
					loop24:
					while (true) {
						int alt24=2;
						int LA24_0 = input.LA(1);
						if ( (LA24_0==STRING_LITERAL||LA24_0==TOKEN_REF) ) {
							alt24=1;
						}

						switch (alt24) {
						case 1 :
							// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:180:13: setElement
							{
							pushFollow(FOLLOW_setElement_in_element1005);
							setElement();
							state._fsp--;
							if (state.failed) return;
							}
							break;

						default :
							if ( cnt24 >= 1 ) break loop24;
							if (state.backtracking>0) {state.failed=true; return;}
							EarlyExitException eee = new EarlyExitException(24, input);
							throw eee;
						}
						cnt24++;
					}

					match(input, Token.UP, null); if (state.failed) return;

					}
					break;
				case 7 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:181:9: RULE_REF
					{
					match(input,RULE_REF,FOLLOW_RULE_REF_in_element1017); if (state.failed) return;
					}
					break;
				case 8 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:182:4: ebnf
					{
					pushFollow(FOLLOW_ebnf_in_element1022);
					ebnf();
					state._fsp--;
					if (state.failed) return;
					}
					break;
				case 9 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:183:4: epsilonElement
					{
					pushFollow(FOLLOW_epsilonElement_in_element1027);
					epsilonElement();
					state._fsp--;
					if (state.failed) return;
					}
					break;

			}
		}
		 
		finally {
			// do for sure before leaving
		}
	}
	// $ANTLR end "element"



	// $ANTLR start "epsilonElement"
	// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:186:1: epsilonElement : ( ACTION | SEMPRED | EPSILON | ^( ACTION elementOptions ) | ^( SEMPRED elementOptions ) );
	public final void epsilonElement() throws RecognitionException {
		try {
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:187:2: ( ACTION | SEMPRED | EPSILON | ^( ACTION elementOptions ) | ^( SEMPRED elementOptions ) )
			int alt26=5;
			switch ( input.LA(1) ) {
			case ACTION:
				{
				int LA26_1 = input.LA(2);
				if ( (LA26_1==DOWN) ) {
					alt26=4;
				}
				else if ( ((LA26_1 >= UP && LA26_1 <= ACTION)||LA26_1==ASSIGN||LA26_1==DOT||LA26_1==NOT||LA26_1==PLUS_ASSIGN||LA26_1==RANGE||LA26_1==RULE_REF||LA26_1==SEMPRED||LA26_1==STRING_LITERAL||LA26_1==TOKEN_REF||(LA26_1 >= BLOCK && LA26_1 <= CLOSURE)||LA26_1==EPSILON||(LA26_1 >= OPTIONAL && LA26_1 <= POSITIVE_CLOSURE)||(LA26_1 >= SET && LA26_1 <= WILDCARD)) ) {
					alt26=1;
				}

				else {
					if (state.backtracking>0) {state.failed=true; return;}
					int nvaeMark = input.mark();
					try {
						input.consume();
						NoViableAltException nvae =
							new NoViableAltException("", 26, 1, input);
						throw nvae;
					} finally {
						input.rewind(nvaeMark);
					}
				}

				}
				break;
			case SEMPRED:
				{
				int LA26_2 = input.LA(2);
				if ( (LA26_2==DOWN) ) {
					alt26=5;
				}
				else if ( ((LA26_2 >= UP && LA26_2 <= ACTION)||LA26_2==ASSIGN||LA26_2==DOT||LA26_2==NOT||LA26_2==PLUS_ASSIGN||LA26_2==RANGE||LA26_2==RULE_REF||LA26_2==SEMPRED||LA26_2==STRING_LITERAL||LA26_2==TOKEN_REF||(LA26_2 >= BLOCK && LA26_2 <= CLOSURE)||LA26_2==EPSILON||(LA26_2 >= OPTIONAL && LA26_2 <= POSITIVE_CLOSURE)||(LA26_2 >= SET && LA26_2 <= WILDCARD)) ) {
					alt26=2;
				}

				else {
					if (state.backtracking>0) {state.failed=true; return;}
					int nvaeMark = input.mark();
					try {
						input.consume();
						NoViableAltException nvae =
							new NoViableAltException("", 26, 2, input);
						throw nvae;
					} finally {
						input.rewind(nvaeMark);
					}
				}

				}
				break;
			case EPSILON:
				{
				alt26=3;
				}
				break;
			default:
				if (state.backtracking>0) {state.failed=true; return;}
				NoViableAltException nvae =
					new NoViableAltException("", 26, 0, input);
				throw nvae;
			}
			switch (alt26) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:187:4: ACTION
					{
					match(input,ACTION,FOLLOW_ACTION_in_epsilonElement1038); if (state.failed) return;
					}
					break;
				case 2 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:188:4: SEMPRED
					{
					match(input,SEMPRED,FOLLOW_SEMPRED_in_epsilonElement1043); if (state.failed) return;
					}
					break;
				case 3 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:189:4: EPSILON
					{
					match(input,EPSILON,FOLLOW_EPSILON_in_epsilonElement1048); if (state.failed) return;
					}
					break;
				case 4 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:190:4: ^( ACTION elementOptions )
					{
					match(input,ACTION,FOLLOW_ACTION_in_epsilonElement1054); if (state.failed) return;
					match(input, Token.DOWN, null); if (state.failed) return;
					pushFollow(FOLLOW_elementOptions_in_epsilonElement1056);
					elementOptions();
					state._fsp--;
					if (state.failed) return;
					match(input, Token.UP, null); if (state.failed) return;

					}
					break;
				case 5 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:191:4: ^( SEMPRED elementOptions )
					{
					match(input,SEMPRED,FOLLOW_SEMPRED_in_epsilonElement1063); if (state.failed) return;
					match(input, Token.DOWN, null); if (state.failed) return;
					pushFollow(FOLLOW_elementOptions_in_epsilonElement1065);
					elementOptions();
					state._fsp--;
					if (state.failed) return;
					match(input, Token.UP, null); if (state.failed) return;

					}
					break;

			}
		}
		 
		finally {
			// do for sure before leaving
		}
	}
	// $ANTLR end "epsilonElement"



	// $ANTLR start "setElement"
	// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:194:1: setElement : ( ^( STRING_LITERAL elementOptions ) | ^( TOKEN_REF elementOptions ) | STRING_LITERAL | TOKEN_REF );
	public final void setElement() throws RecognitionException {
		try {
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:195:2: ( ^( STRING_LITERAL elementOptions ) | ^( TOKEN_REF elementOptions ) | STRING_LITERAL | TOKEN_REF )
			int alt27=4;
			int LA27_0 = input.LA(1);
			if ( (LA27_0==STRING_LITERAL) ) {
				int LA27_1 = input.LA(2);
				if ( (LA27_1==DOWN) ) {
					alt27=1;
				}
				else if ( (LA27_1==UP||LA27_1==STRING_LITERAL||LA27_1==TOKEN_REF) ) {
					alt27=3;
				}

				else {
					if (state.backtracking>0) {state.failed=true; return;}
					int nvaeMark = input.mark();
					try {
						input.consume();
						NoViableAltException nvae =
							new NoViableAltException("", 27, 1, input);
						throw nvae;
					} finally {
						input.rewind(nvaeMark);
					}
				}

			}
			else if ( (LA27_0==TOKEN_REF) ) {
				int LA27_2 = input.LA(2);
				if ( (LA27_2==DOWN) ) {
					alt27=2;
				}
				else if ( (LA27_2==UP||LA27_2==STRING_LITERAL||LA27_2==TOKEN_REF) ) {
					alt27=4;
				}

				else {
					if (state.backtracking>0) {state.failed=true; return;}
					int nvaeMark = input.mark();
					try {
						input.consume();
						NoViableAltException nvae =
							new NoViableAltException("", 27, 2, input);
						throw nvae;
					} finally {
						input.rewind(nvaeMark);
					}
				}

			}

			else {
				if (state.backtracking>0) {state.failed=true; return;}
				NoViableAltException nvae =
					new NoViableAltException("", 27, 0, input);
				throw nvae;
			}

			switch (alt27) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:195:4: ^( STRING_LITERAL elementOptions )
					{
					match(input,STRING_LITERAL,FOLLOW_STRING_LITERAL_in_setElement1078); if (state.failed) return;
					match(input, Token.DOWN, null); if (state.failed) return;
					pushFollow(FOLLOW_elementOptions_in_setElement1080);
					elementOptions();
					state._fsp--;
					if (state.failed) return;
					match(input, Token.UP, null); if (state.failed) return;

					}
					break;
				case 2 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:196:4: ^( TOKEN_REF elementOptions )
					{
					match(input,TOKEN_REF,FOLLOW_TOKEN_REF_in_setElement1087); if (state.failed) return;
					match(input, Token.DOWN, null); if (state.failed) return;
					pushFollow(FOLLOW_elementOptions_in_setElement1089);
					elementOptions();
					state._fsp--;
					if (state.failed) return;
					match(input, Token.UP, null); if (state.failed) return;

					}
					break;
				case 3 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:197:4: STRING_LITERAL
					{
					match(input,STRING_LITERAL,FOLLOW_STRING_LITERAL_in_setElement1095); if (state.failed) return;
					}
					break;
				case 4 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:198:4: TOKEN_REF
					{
					match(input,TOKEN_REF,FOLLOW_TOKEN_REF_in_setElement1100); if (state.failed) return;
					}
					break;

			}
		}
		 
		finally {
			// do for sure before leaving
		}
	}
	// $ANTLR end "setElement"



	// $ANTLR start "ebnf"
	// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:201:1: ebnf : ( block | ^( OPTIONAL block ) | ^( CLOSURE block ) | ^( POSITIVE_CLOSURE block ) );
	public final void ebnf() throws RecognitionException {
		try {
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:201:5: ( block | ^( OPTIONAL block ) | ^( CLOSURE block ) | ^( POSITIVE_CLOSURE block ) )
			int alt28=4;
			switch ( input.LA(1) ) {
			case BLOCK:
				{
				alt28=1;
				}
				break;
			case OPTIONAL:
				{
				alt28=2;
				}
				break;
			case CLOSURE:
				{
				alt28=3;
				}
				break;
			case POSITIVE_CLOSURE:
				{
				alt28=4;
				}
				break;
			default:
				if (state.backtracking>0) {state.failed=true; return;}
				NoViableAltException nvae =
					new NoViableAltException("", 28, 0, input);
				throw nvae;
			}
			switch (alt28) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:201:9: block
					{
					pushFollow(FOLLOW_block_in_ebnf1111);
					block();
					state._fsp--;
					if (state.failed) return;
					}
					break;
				case 2 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:202:9: ^( OPTIONAL block )
					{
					match(input,OPTIONAL,FOLLOW_OPTIONAL_in_ebnf1123); if (state.failed) return;
					match(input, Token.DOWN, null); if (state.failed) return;
					pushFollow(FOLLOW_block_in_ebnf1125);
					block();
					state._fsp--;
					if (state.failed) return;
					match(input, Token.UP, null); if (state.failed) return;

					}
					break;
				case 3 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:203:9: ^( CLOSURE block )
					{
					match(input,CLOSURE,FOLLOW_CLOSURE_in_ebnf1139); if (state.failed) return;
					match(input, Token.DOWN, null); if (state.failed) return;
					pushFollow(FOLLOW_block_in_ebnf1141);
					block();
					state._fsp--;
					if (state.failed) return;
					match(input, Token.UP, null); if (state.failed) return;

					}
					break;
				case 4 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:204:9: ^( POSITIVE_CLOSURE block )
					{
					match(input,POSITIVE_CLOSURE,FOLLOW_POSITIVE_CLOSURE_in_ebnf1155); if (state.failed) return;
					match(input, Token.DOWN, null); if (state.failed) return;
					pushFollow(FOLLOW_block_in_ebnf1157);
					block();
					state._fsp--;
					if (state.failed) return;
					match(input, Token.UP, null); if (state.failed) return;

					}
					break;

			}
		}
		 
		finally {
			// do for sure before leaving
		}
	}
	// $ANTLR end "ebnf"



	// $ANTLR start "block"
	// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:207:1: block : ^( BLOCK ( ACTION )? ( alternative )+ ) ;
	public final void block() throws RecognitionException {
		try {
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:208:5: ( ^( BLOCK ( ACTION )? ( alternative )+ ) )
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:208:7: ^( BLOCK ( ACTION )? ( alternative )+ )
			{
			match(input,BLOCK,FOLLOW_BLOCK_in_block1177); if (state.failed) return;
			match(input, Token.DOWN, null); if (state.failed) return;
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:208:15: ( ACTION )?
			int alt29=2;
			int LA29_0 = input.LA(1);
			if ( (LA29_0==ACTION) ) {
				alt29=1;
			}
			switch (alt29) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:208:15: ACTION
					{
					match(input,ACTION,FOLLOW_ACTION_in_block1179); if (state.failed) return;
					}
					break;

			}

			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:208:23: ( alternative )+
			int cnt30=0;
			loop30:
			while (true) {
				int alt30=2;
				int LA30_0 = input.LA(1);
				if ( (LA30_0==ALT) ) {
					alt30=1;
				}

				switch (alt30) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:208:23: alternative
					{
					pushFollow(FOLLOW_alternative_in_block1182);
					alternative();
					state._fsp--;
					if (state.failed) return;
					}
					break;

				default :
					if ( cnt30 >= 1 ) break loop30;
					if (state.backtracking>0) {state.failed=true; return;}
					EarlyExitException eee = new EarlyExitException(30, input);
					throw eee;
				}
				cnt30++;
			}

			match(input, Token.UP, null); if (state.failed) return;

			}

		}
		 
		finally {
			// do for sure before leaving
		}
	}
	// $ANTLR end "block"



	// $ANTLR start "alternative"
	// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:211:1: alternative : ^( ALT ( elementOptions )? ( element )+ ) ;
	public final void alternative() throws RecognitionException {
		try {
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:212:2: ( ^( ALT ( elementOptions )? ( element )+ ) )
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:212:4: ^( ALT ( elementOptions )? ( element )+ )
			{
			match(input,ALT,FOLLOW_ALT_in_alternative1199); if (state.failed) return;
			match(input, Token.DOWN, null); if (state.failed) return;
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:212:10: ( elementOptions )?
			int alt31=2;
			int LA31_0 = input.LA(1);
			if ( (LA31_0==ELEMENT_OPTIONS) ) {
				alt31=1;
			}
			switch (alt31) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:212:10: elementOptions
					{
					pushFollow(FOLLOW_elementOptions_in_alternative1201);
					elementOptions();
					state._fsp--;
					if (state.failed) return;
					}
					break;

			}

			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:212:26: ( element )+
			int cnt32=0;
			loop32:
			while (true) {
				int alt32=2;
				int LA32_0 = input.LA(1);
				if ( (LA32_0==ACTION||LA32_0==ASSIGN||LA32_0==DOT||LA32_0==NOT||LA32_0==PLUS_ASSIGN||LA32_0==RANGE||LA32_0==RULE_REF||LA32_0==SEMPRED||LA32_0==STRING_LITERAL||LA32_0==TOKEN_REF||(LA32_0 >= BLOCK && LA32_0 <= CLOSURE)||LA32_0==EPSILON||(LA32_0 >= OPTIONAL && LA32_0 <= POSITIVE_CLOSURE)||(LA32_0 >= SET && LA32_0 <= WILDCARD)) ) {
					alt32=1;
				}

				switch (alt32) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:212:26: element
					{
					pushFollow(FOLLOW_element_in_alternative1204);
					element();
					state._fsp--;
					if (state.failed) return;
					}
					break;

				default :
					if ( cnt32 >= 1 ) break loop32;
					if (state.backtracking>0) {state.failed=true; return;}
					EarlyExitException eee = new EarlyExitException(32, input);
					throw eee;
				}
				cnt32++;
			}

			match(input, Token.UP, null); if (state.failed) return;

			}

		}
		 
		finally {
			// do for sure before leaving
		}
	}
	// $ANTLR end "alternative"



	// $ANTLR start "atom"
	// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:215:1: atom : ( ^( RULE_REF ( ARG_ACTION )? ( elementOptions )? ) | ^( STRING_LITERAL elementOptions ) | STRING_LITERAL | ^( TOKEN_REF elementOptions ) | TOKEN_REF | ^( WILDCARD elementOptions ) | WILDCARD | ^( DOT ID element ) );
	public final void atom() throws RecognitionException {
		try {
			// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:216:2: ( ^( RULE_REF ( ARG_ACTION )? ( elementOptions )? ) | ^( STRING_LITERAL elementOptions ) | STRING_LITERAL | ^( TOKEN_REF elementOptions ) | TOKEN_REF | ^( WILDCARD elementOptions ) | WILDCARD | ^( DOT ID element ) )
			int alt35=8;
			switch ( input.LA(1) ) {
			case RULE_REF:
				{
				alt35=1;
				}
				break;
			case STRING_LITERAL:
				{
				int LA35_2 = input.LA(2);
				if ( (LA35_2==DOWN) ) {
					alt35=2;
				}
				else if ( ((LA35_2 >= UP && LA35_2 <= ACTION)||LA35_2==ASSIGN||LA35_2==DOT||LA35_2==NOT||LA35_2==PLUS_ASSIGN||LA35_2==RANGE||LA35_2==RULE_REF||LA35_2==SEMPRED||LA35_2==STRING_LITERAL||LA35_2==TOKEN_REF||(LA35_2 >= BLOCK && LA35_2 <= CLOSURE)||LA35_2==EPSILON||(LA35_2 >= OPTIONAL && LA35_2 <= POSITIVE_CLOSURE)||(LA35_2 >= SET && LA35_2 <= WILDCARD)) ) {
					alt35=3;
				}

				else {
					if (state.backtracking>0) {state.failed=true; return;}
					int nvaeMark = input.mark();
					try {
						input.consume();
						NoViableAltException nvae =
							new NoViableAltException("", 35, 2, input);
						throw nvae;
					} finally {
						input.rewind(nvaeMark);
					}
				}

				}
				break;
			case TOKEN_REF:
				{
				int LA35_3 = input.LA(2);
				if ( (LA35_3==DOWN) ) {
					alt35=4;
				}
				else if ( ((LA35_3 >= UP && LA35_3 <= ACTION)||LA35_3==ASSIGN||LA35_3==DOT||LA35_3==NOT||LA35_3==PLUS_ASSIGN||LA35_3==RANGE||LA35_3==RULE_REF||LA35_3==SEMPRED||LA35_3==STRING_LITERAL||LA35_3==TOKEN_REF||(LA35_3 >= BLOCK && LA35_3 <= CLOSURE)||LA35_3==EPSILON||(LA35_3 >= OPTIONAL && LA35_3 <= POSITIVE_CLOSURE)||(LA35_3 >= SET && LA35_3 <= WILDCARD)) ) {
					alt35=5;
				}

				else {
					if (state.backtracking>0) {state.failed=true; return;}
					int nvaeMark = input.mark();
					try {
						input.consume();
						NoViableAltException nvae =
							new NoViableAltException("", 35, 3, input);
						throw nvae;
					} finally {
						input.rewind(nvaeMark);
					}
				}

				}
				break;
			case WILDCARD:
				{
				int LA35_4 = input.LA(2);
				if ( (LA35_4==DOWN) ) {
					alt35=6;
				}
				else if ( ((LA35_4 >= UP && LA35_4 <= ACTION)||LA35_4==ASSIGN||LA35_4==DOT||LA35_4==NOT||LA35_4==PLUS_ASSIGN||LA35_4==RANGE||LA35_4==RULE_REF||LA35_4==SEMPRED||LA35_4==STRING_LITERAL||LA35_4==TOKEN_REF||(LA35_4 >= BLOCK && LA35_4 <= CLOSURE)||LA35_4==EPSILON||(LA35_4 >= OPTIONAL && LA35_4 <= POSITIVE_CLOSURE)||(LA35_4 >= SET && LA35_4 <= WILDCARD)) ) {
					alt35=7;
				}

				else {
					if (state.backtracking>0) {state.failed=true; return;}
					int nvaeMark = input.mark();
					try {
						input.consume();
						NoViableAltException nvae =
							new NoViableAltException("", 35, 4, input);
						throw nvae;
					} finally {
						input.rewind(nvaeMark);
					}
				}

				}
				break;
			case DOT:
				{
				alt35=8;
				}
				break;
			default:
				if (state.backtracking>0) {state.failed=true; return;}
				NoViableAltException nvae =
					new NoViableAltException("", 35, 0, input);
				throw nvae;
			}
			switch (alt35) {
				case 1 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:216:4: ^( RULE_REF ( ARG_ACTION )? ( elementOptions )? )
					{
					match(input,RULE_REF,FOLLOW_RULE_REF_in_atom1221); if (state.failed) return;
					if ( input.LA(1)==Token.DOWN ) {
						match(input, Token.DOWN, null); if (state.failed) return;
						// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:216:15: ( ARG_ACTION )?
						int alt33=2;
						int LA33_0 = input.LA(1);
						if ( (LA33_0==ARG_ACTION) ) {
							alt33=1;
						}
						switch (alt33) {
							case 1 :
								// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:216:15: ARG_ACTION
								{
								match(input,ARG_ACTION,FOLLOW_ARG_ACTION_in_atom1223); if (state.failed) return;
								}
								break;

						}

						// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:216:27: ( elementOptions )?
						int alt34=2;
						int LA34_0 = input.LA(1);
						if ( (LA34_0==ELEMENT_OPTIONS) ) {
							alt34=1;
						}
						switch (alt34) {
							case 1 :
								// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:216:27: elementOptions
								{
								pushFollow(FOLLOW_elementOptions_in_atom1226);
								elementOptions();
								state._fsp--;
								if (state.failed) return;
								}
								break;

						}

						match(input, Token.UP, null); if (state.failed) return;
					}

					}
					break;
				case 2 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:217:8: ^( STRING_LITERAL elementOptions )
					{
					match(input,STRING_LITERAL,FOLLOW_STRING_LITERAL_in_atom1238); if (state.failed) return;
					match(input, Token.DOWN, null); if (state.failed) return;
					pushFollow(FOLLOW_elementOptions_in_atom1240);
					elementOptions();
					state._fsp--;
					if (state.failed) return;
					match(input, Token.UP, null); if (state.failed) return;

					}
					break;
				case 3 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:218:4: STRING_LITERAL
					{
					match(input,STRING_LITERAL,FOLLOW_STRING_LITERAL_in_atom1246); if (state.failed) return;
					}
					break;
				case 4 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:219:7: ^( TOKEN_REF elementOptions )
					{
					match(input,TOKEN_REF,FOLLOW_TOKEN_REF_in_atom1255); if (state.failed) return;
					match(input, Token.DOWN, null); if (state.failed) return;
					pushFollow(FOLLOW_elementOptions_in_atom1257);
					elementOptions();
					state._fsp--;
					if (state.failed) return;
					match(input, Token.UP, null); if (state.failed) return;

					}
					break;
				case 5 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:220:4: TOKEN_REF
					{
					match(input,TOKEN_REF,FOLLOW_TOKEN_REF_in_atom1263); if (state.failed) return;
					}
					break;
				case 6 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:221:7: ^( WILDCARD elementOptions )
					{
					match(input,WILDCARD,FOLLOW_WILDCARD_in_atom1272); if (state.failed) return;
					match(input, Token.DOWN, null); if (state.failed) return;
					pushFollow(FOLLOW_elementOptions_in_atom1274);
					elementOptions();
					state._fsp--;
					if (state.failed) return;
					match(input, Token.UP, null); if (state.failed) return;

					}
					break;
				case 7 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:222:4: WILDCARD
					{
					match(input,WILDCARD,FOLLOW_WILDCARD_in_atom1280); if (state.failed) return;
					}
					break;
				case 8 :
					// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:223:4: ^( DOT ID element )
					{
					match(input,DOT,FOLLOW_DOT_in_atom1286); if (state.failed) return;
					match(input, Token.DOWN, null); if (state.failed) return;
					match(input,ID,FOLLOW_ID_in_atom1288); if (state.failed) return;
					pushFollow(FOLLOW_element_in_atom1290);
					element();
					state._fsp--;
					if (state.failed) return;
					match(input, Token.UP, null); if (state.failed) return;

					}
					break;

			}
		}
		 
		finally {
			// do for sure before leaving
		}
	}
	// $ANTLR end "atom"

	// $ANTLR start synpred1_LeftRecursiveRuleWalker
	public final void synpred1_LeftRecursiveRuleWalker_fragment() throws RecognitionException {
		// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:114:9: ( binary )
		// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:114:10: binary
		{
		pushFollow(FOLLOW_binary_in_synpred1_LeftRecursiveRuleWalker348);
		binary();
		state._fsp--;
		if (state.failed) return;
		}

	}
	// $ANTLR end synpred1_LeftRecursiveRuleWalker

	// $ANTLR start synpred2_LeftRecursiveRuleWalker
	public final void synpred2_LeftRecursiveRuleWalker_fragment() throws RecognitionException {
		// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:116:9: ( prefix )
		// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:116:10: prefix
		{
		pushFollow(FOLLOW_prefix_in_synpred2_LeftRecursiveRuleWalker404);
		prefix();
		state._fsp--;
		if (state.failed) return;
		}

	}
	// $ANTLR end synpred2_LeftRecursiveRuleWalker

	// $ANTLR start synpred3_LeftRecursiveRuleWalker
	public final void synpred3_LeftRecursiveRuleWalker_fragment() throws RecognitionException {
		// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:118:9: ( suffix )
		// org/antlr/v4/parse/LeftRecursiveRuleWalker.g:118:10: suffix
		{
		pushFollow(FOLLOW_suffix_in_synpred3_LeftRecursiveRuleWalker460);
		suffix();
		state._fsp--;
		if (state.failed) return;
		}

	}
	// $ANTLR end synpred3_LeftRecursiveRuleWalker

	// Delegated rules

	public final boolean synpred1_LeftRecursiveRuleWalker() {
		state.backtracking++;
		int start = input.mark();
		try {
			synpred1_LeftRecursiveRuleWalker_fragment(); // can never throw exception
		} catch (RecognitionException re) {
			System.err.println("impossible: "+re);
		}
		boolean success = !state.failed;
		input.rewind(start);
		state.backtracking--;
		state.failed=false;
		return success;
	}
	public final boolean synpred2_LeftRecursiveRuleWalker() {
		state.backtracking++;
		int start = input.mark();
		try {
			synpred2_LeftRecursiveRuleWalker_fragment(); // can never throw exception
		} catch (RecognitionException re) {
			System.err.println("impossible: "+re);
		}
		boolean success = !state.failed;
		input.rewind(start);
		state.backtracking--;
		state.failed=false;
		return success;
	}
	public final boolean synpred3_LeftRecursiveRuleWalker() {
		state.backtracking++;
		int start = input.mark();
		try {
			synpred3_LeftRecursiveRuleWalker_fragment(); // can never throw exception
		} catch (RecognitionException re) {
			System.err.println("impossible: "+re);
		}
		boolean success = !state.failed;
		input.rewind(start);
		state.backtracking--;
		state.failed=false;
		return success;
	}


	protected DFA11 dfa11 = new DFA11(this);
	protected DFA14 dfa14 = new DFA14(this);
	static final String DFA11_eotS =
		"\130\uffff";
	static final String DFA11_eofS =
		"\130\uffff";
	static final String DFA11_minS =
		"\1\4\3\2\1\uffff\2\34\2\2\1\3\1\uffff\2\4\2\111\4\2\4\3\2\2\2\3\1\2\2"+
		"\3\1\2\1\3\2\111\1\34\1\3\1\34\1\3\2\2\2\4\13\3\1\2\2\3\1\2\11\3\1\34"+
		"\1\3\1\34\1\3\2\4\20\3";
	static final String DFA11_maxS =
		"\1\123\2\2\1\123\1\uffff\2\34\3\123\1\uffff\2\123\2\111\2\3\2\2\2\123"+
		"\2\34\3\123\1\34\1\2\1\3\1\34\1\2\1\3\2\111\1\34\1\123\1\34\1\123\2\2"+
		"\2\73\2\34\10\3\1\34\1\2\1\3\1\34\1\2\1\3\11\34\1\123\1\34\1\123\2\73"+
		"\10\3\10\34";
	static final String DFA11_acceptS =
		"\4\uffff\1\1\5\uffff\1\2\115\uffff";
	static final String DFA11_specialS =
		"\130\uffff}>";
	static final String[] DFA11_transitionS = {
			"\1\4\5\uffff\1\1\11\uffff\1\4\22\uffff\1\4\6\uffff\1\2\2\uffff\1\4\4"+
			"\uffff\1\3\1\uffff\1\4\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff\1"+
			"\4\2\uffff\2\4\3\uffff\2\4",
			"\1\5",
			"\1\6",
			"\1\4\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff"+
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff"+
			"\1\11\2\uffff\2\4\3\uffff\2\4",
			"",
			"\1\13",
			"\1\14",
			"\1\15\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff"+
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff"+
			"\1\11\2\uffff\2\4\3\uffff\2\4",
			"\1\16\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff"+
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff"+
			"\1\11\2\uffff\2\4\3\uffff\2\4",
			"\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff"+
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff"+
			"\1\11\2\uffff\2\4\3\uffff\2\4",
			"",
			"\1\4\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff\1\4\4"+
			"\uffff\1\17\1\uffff\1\4\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff\1"+
			"\4\2\uffff\2\4\3\uffff\2\4",
			"\1\4\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff\1\4\4"+
			"\uffff\1\20\1\uffff\1\4\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff\1"+
			"\4\2\uffff\2\4\3\uffff\2\4",
			"\1\21",
			"\1\22",
			"\1\4\1\23",
			"\1\4\1\24",
			"\1\25",
			"\1\26",
			"\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff"+
			"\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff"+
			"\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff"+
			"\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff"+
			"\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\40\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2"+
			"\uffff\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2"+
			"\4\2\uffff\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\41\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2"+
			"\uffff\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2"+
			"\4\2\uffff\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff"+
			"\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff"+
			"\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\42",
			"\1\43",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\44",
			"\1\45",
			"\1\46",
			"\1\47",
			"\1\50",
			"\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff"+
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff"+
			"\1\11\2\uffff\2\4\3\uffff\2\4",
			"\1\51",
			"\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff"+
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff"+
			"\1\11\2\uffff\2\4\3\uffff\2\4",
			"\1\52",
			"\1\53",
			"\1\56\27\uffff\1\54\1\uffff\1\57\34\uffff\1\55",
			"\1\62\27\uffff\1\60\1\uffff\1\63\34\uffff\1\61",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\71\6\uffff\1\70\21\uffff\1\67",
			"\1\72",
			"\1\73",
			"\1\74",
			"\1\75",
			"\1\76",
			"\1\77",
			"\1\100",
			"\1\101",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\102",
			"\1\103",
			"\1\71\6\uffff\1\70\21\uffff\1\67",
			"\1\104",
			"\1\105",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\106",
			"\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff"+
			"\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff"+
			"\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\107",
			"\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff"+
			"\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff"+
			"\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\112\27\uffff\1\110\1\uffff\1\113\34\uffff\1\111",
			"\1\116\27\uffff\1\114\1\uffff\1\117\34\uffff\1\115",
			"\1\120",
			"\1\121",
			"\1\122",
			"\1\123",
			"\1\124",
			"\1\125",
			"\1\126",
			"\1\127",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\71\6\uffff\1\70\21\uffff\1\67",
			"\1\71\6\uffff\1\70\21\uffff\1\67",
			"\1\71\6\uffff\1\70\21\uffff\1\67",
			"\1\71\6\uffff\1\70\21\uffff\1\67"
	};

	static final short[] DFA11_eot = DFA.unpackEncodedString(DFA11_eotS);
	static final short[] DFA11_eof = DFA.unpackEncodedString(DFA11_eofS);
	static final char[] DFA11_min = DFA.unpackEncodedStringToUnsignedChars(DFA11_minS);
	static final char[] DFA11_max = DFA.unpackEncodedStringToUnsignedChars(DFA11_maxS);
	static final short[] DFA11_accept = DFA.unpackEncodedString(DFA11_acceptS);
	static final short[] DFA11_special = DFA.unpackEncodedString(DFA11_specialS);
	static final short[][] DFA11_transition;

	static {
		int numStates = DFA11_transitionS.length;
		DFA11_transition = new short[numStates][];
		for (int i=0; i<numStates; i++) {
			DFA11_transition[i] = DFA.unpackEncodedString(DFA11_transitionS[i]);
		}
	}

	protected class DFA11 extends DFA {

		public DFA11(BaseRecognizer recognizer) {
			this.recognizer = recognizer;
			this.decisionNumber = 11;
			this.eot = DFA11_eot;
			this.eof = DFA11_eof;
			this.min = DFA11_min;
			this.max = DFA11_max;
			this.accept = DFA11_accept;
			this.special = DFA11_special;
			this.transition = DFA11_transition;
		}
		@Override
		public String getDescription() {
			return "()* loopback of 124:35: ( element )*";
		}
	}

	static final String DFA14_eotS =
		"\130\uffff";
	static final String DFA14_eofS =
		"\130\uffff";
	static final String DFA14_minS =
		"\1\4\3\2\1\uffff\2\34\2\2\1\3\1\uffff\2\4\2\111\4\2\4\3\2\2\2\3\1\2\2"+
		"\3\1\2\1\3\2\111\1\34\1\3\1\34\1\3\2\2\2\4\13\3\1\2\2\3\1\2\11\3\1\34"+
		"\1\3\1\34\1\3\2\4\20\3";
	static final String DFA14_maxS =
		"\1\123\2\2\1\123\1\uffff\2\34\3\123\1\uffff\2\123\2\111\2\3\2\2\2\123"+
		"\2\34\3\123\1\34\1\2\1\3\1\34\1\2\1\3\2\111\1\34\1\123\1\34\1\123\2\2"+
		"\2\73\2\34\10\3\1\34\1\2\1\3\1\34\1\2\1\3\11\34\1\123\1\34\1\123\2\73"+
		"\10\3\10\34";
	static final String DFA14_acceptS =
		"\4\uffff\1\1\5\uffff\1\2\115\uffff";
	static final String DFA14_specialS =
		"\130\uffff}>";
	static final String[] DFA14_transitionS = {
			"\1\4\5\uffff\1\1\11\uffff\1\4\22\uffff\1\4\6\uffff\1\2\2\uffff\1\4\4"+
			"\uffff\1\3\1\uffff\1\4\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff\1"+
			"\4\2\uffff\2\4\3\uffff\2\4",
			"\1\5",
			"\1\6",
			"\1\4\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff"+
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff"+
			"\1\11\2\uffff\2\4\3\uffff\2\4",
			"",
			"\1\13",
			"\1\14",
			"\1\15\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff"+
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff"+
			"\1\11\2\uffff\2\4\3\uffff\2\4",
			"\1\16\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff"+
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff"+
			"\1\11\2\uffff\2\4\3\uffff\2\4",
			"\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff"+
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff"+
			"\1\11\2\uffff\2\4\3\uffff\2\4",
			"",
			"\1\4\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff\1\4\4"+
			"\uffff\1\17\1\uffff\1\4\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff\1"+
			"\4\2\uffff\2\4\3\uffff\2\4",
			"\1\4\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff\1\4\4"+
			"\uffff\1\20\1\uffff\1\4\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff\1"+
			"\4\2\uffff\2\4\3\uffff\2\4",
			"\1\21",
			"\1\22",
			"\1\4\1\23",
			"\1\4\1\24",
			"\1\25",
			"\1\26",
			"\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff"+
			"\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff"+
			"\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff"+
			"\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff"+
			"\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\40\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2"+
			"\uffff\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2"+
			"\4\2\uffff\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\41\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2"+
			"\uffff\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2"+
			"\4\2\uffff\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff"+
			"\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff"+
			"\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\42",
			"\1\43",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\44",
			"\1\45",
			"\1\46",
			"\1\47",
			"\1\50",
			"\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff"+
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff"+
			"\1\11\2\uffff\2\4\3\uffff\2\4",
			"\1\51",
			"\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff"+
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff"+
			"\1\11\2\uffff\2\4\3\uffff\2\4",
			"\1\52",
			"\1\53",
			"\1\56\27\uffff\1\54\1\uffff\1\57\34\uffff\1\55",
			"\1\62\27\uffff\1\60\1\uffff\1\63\34\uffff\1\61",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\71\6\uffff\1\70\21\uffff\1\67",
			"\1\72",
			"\1\73",
			"\1\74",
			"\1\75",
			"\1\76",
			"\1\77",
			"\1\100",
			"\1\101",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\102",
			"\1\103",
			"\1\71\6\uffff\1\70\21\uffff\1\67",
			"\1\104",
			"\1\105",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\106",
			"\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff"+
			"\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff"+
			"\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\107",
			"\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff"+
			"\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff"+
			"\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\112\27\uffff\1\110\1\uffff\1\113\34\uffff\1\111",
			"\1\116\27\uffff\1\114\1\uffff\1\117\34\uffff\1\115",
			"\1\120",
			"\1\121",
			"\1\122",
			"\1\123",
			"\1\124",
			"\1\125",
			"\1\126",
			"\1\127",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\71\6\uffff\1\70\21\uffff\1\67",
			"\1\71\6\uffff\1\70\21\uffff\1\67",
			"\1\71\6\uffff\1\70\21\uffff\1\67",
			"\1\71\6\uffff\1\70\21\uffff\1\67"
	};

	static final short[] DFA14_eot = DFA.unpackEncodedString(DFA14_eotS);
	static final short[] DFA14_eof = DFA.unpackEncodedString(DFA14_eofS);
	static final char[] DFA14_min = DFA.unpackEncodedStringToUnsignedChars(DFA14_minS);
	static final char[] DFA14_max = DFA.unpackEncodedStringToUnsignedChars(DFA14_maxS);
	static final short[] DFA14_accept = DFA.unpackEncodedString(DFA14_acceptS);
	static final short[] DFA14_special = DFA.unpackEncodedString(DFA14_specialS);
	static final short[][] DFA14_transition;

	static {
		int numStates = DFA14_transitionS.length;
		DFA14_transition = new short[numStates][];
		for (int i=0; i<numStates; i++) {
			DFA14_transition[i] = DFA.unpackEncodedString(DFA14_transitionS[i]);
		}
	}

	protected class DFA14 extends DFA {

		public DFA14(BaseRecognizer recognizer) {
			this.recognizer = recognizer;
			this.decisionNumber = 14;
			this.eot = DFA14_eot;
			this.eof = DFA14_eof;
			this.min = DFA14_min;
			this.max = DFA14_max;
			this.accept = DFA14_accept;
			this.special = DFA14_special;
			this.transition = DFA14_transition;
		}
		@Override
		public String getDescription() {
			return "()+ loopback of 130:4: ( element )+";
		}
	}

	public static final BitSet FOLLOW_RULE_in_rec_rule72 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_RULE_REF_in_rec_rule76 = new BitSet(new long[]{0x0010040200000800L,0x0000000000700040L});
	public static final BitSet FOLLOW_ruleModifier_in_rec_rule83 = new BitSet(new long[]{0x0010040200000800L,0x0000000000000040L});
	public static final BitSet FOLLOW_RETURNS_in_rec_rule92 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_ARG_ACTION_in_rec_rule96 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_LOCALS_in_rec_rule115 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_ARG_ACTION_in_rec_rule117 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_OPTIONS_in_rec_rule135 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_AT_in_rec_rule152 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_ID_in_rec_rule154 = new BitSet(new long[]{0x0000000000000010L});
	public static final BitSet FOLLOW_ACTION_in_rec_rule156 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_ruleBlock_in_rec_rule172 = new BitSet(new long[]{0x0000000000801008L});
	public static final BitSet FOLLOW_exceptionGroup_in_rec_rule179 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_exceptionHandler_in_exceptionGroup197 = new BitSet(new long[]{0x0000000000801002L});
	public static final BitSet FOLLOW_finallyClause_in_exceptionGroup200 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_CATCH_in_exceptionHandler216 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_ARG_ACTION_in_exceptionHandler218 = new BitSet(new long[]{0x0000000000000010L});
	public static final BitSet FOLLOW_ACTION_in_exceptionHandler220 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_FINALLY_in_finallyClause233 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_ACTION_in_finallyClause235 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_BLOCK_in_ruleBlock290 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_outerAlternative_in_ruleBlock303 = new BitSet(new long[]{0x0000000000000008L,0x0000000000000020L});
	public static final BitSet FOLLOW_binary_in_outerAlternative362 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_prefix_in_outerAlternative418 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_suffix_in_outerAlternative474 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_nonLeftRecur_in_outerAlternative515 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_ALT_in_binary541 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_elementOptions_in_binary543 = new BitSet(new long[]{0x0040400000000400L});
	public static final BitSet FOLLOW_recurse_in_binary546 = new BitSet(new long[]{0x4942408000100410L,0x00000000000C64C0L});
	public static final BitSet FOLLOW_element_in_binary548 = new BitSet(new long[]{0x4942408000100410L,0x00000000000C64C0L});
	public static final BitSet FOLLOW_recurse_in_binary551 = new BitSet(new long[]{0x0100000000000018L,0x0000000000000400L});
	public static final BitSet FOLLOW_epsilonElement_in_binary553 = new BitSet(new long[]{0x0100000000000018L,0x0000000000000400L});
	public static final BitSet FOLLOW_ALT_in_prefix579 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_elementOptions_in_prefix581 = new BitSet(new long[]{0x4942408000100410L,0x00000000000C64C0L});
	public static final BitSet FOLLOW_element_in_prefix587 = new BitSet(new long[]{0x4942408000100410L,0x00000000000C64C0L});
	public static final BitSet FOLLOW_recurse_in_prefix593 = new BitSet(new long[]{0x0100000000000018L,0x0000000000000400L});
	public static final BitSet FOLLOW_epsilonElement_in_prefix595 = new BitSet(new long[]{0x0100000000000018L,0x0000000000000400L});
	public static final BitSet FOLLOW_ALT_in_suffix630 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_elementOptions_in_suffix632 = new BitSet(new long[]{0x0040400000000400L});
	public static final BitSet FOLLOW_recurse_in_suffix635 = new BitSet(new long[]{0x4942408000100410L,0x00000000000C64C0L});
	public static final BitSet FOLLOW_element_in_suffix637 = new BitSet(new long[]{0x4942408000100418L,0x00000000000C64C0L});
	public static final BitSet FOLLOW_ALT_in_nonLeftRecur671 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_elementOptions_in_nonLeftRecur673 = new BitSet(new long[]{0x4942408000100410L,0x00000000000C64C0L});
	public static final BitSet FOLLOW_element_in_nonLeftRecur676 = new BitSet(new long[]{0x4942408000100418L,0x00000000000C64C0L});
	public static final BitSet FOLLOW_ASSIGN_in_recurse693 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_ID_in_recurse695 = new BitSet(new long[]{0x0040000000000000L});
	public static final BitSet FOLLOW_recurseNoLabel_in_recurse697 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_PLUS_ASSIGN_in_recurse704 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_ID_in_recurse706 = new BitSet(new long[]{0x0040000000000000L});
	public static final BitSet FOLLOW_recurseNoLabel_in_recurse708 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_recurseNoLabel_in_recurse714 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_RULE_REF_in_recurseNoLabel726 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_ASSIGN_in_token740 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_ID_in_token742 = new BitSet(new long[]{0x4800400000000400L});
	public static final BitSet FOLLOW_token_in_token746 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_PLUS_ASSIGN_in_token755 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_ID_in_token757 = new BitSet(new long[]{0x4800400000000400L});
	public static final BitSet FOLLOW_token_in_token761 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_STRING_LITERAL_in_token771 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_STRING_LITERAL_in_token792 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_elementOptions_in_token794 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_TOKEN_REF_in_token809 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_elementOptions_in_token811 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_TOKEN_REF_in_token823 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_ELEMENT_OPTIONS_in_elementOptions853 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_elementOption_in_elementOptions855 = new BitSet(new long[]{0x0000000010000408L});
	public static final BitSet FOLLOW_ID_in_elementOption874 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_ASSIGN_in_elementOption885 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_ID_in_elementOption887 = new BitSet(new long[]{0x0000000010000000L});
	public static final BitSet FOLLOW_ID_in_elementOption889 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_ASSIGN_in_elementOption901 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_ID_in_elementOption903 = new BitSet(new long[]{0x0800000000000000L});
	public static final BitSet FOLLOW_STRING_LITERAL_in_elementOption905 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_ASSIGN_in_elementOption917 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_ID_in_elementOption919 = new BitSet(new long[]{0x0000000000000010L});
	public static final BitSet FOLLOW_ACTION_in_elementOption921 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_ASSIGN_in_elementOption933 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_ID_in_elementOption935 = new BitSet(new long[]{0x0000000040000000L});
	public static final BitSet FOLLOW_INT_in_elementOption937 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_atom_in_element952 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_NOT_in_element958 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_element_in_element960 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_RANGE_in_element967 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_atom_in_element969 = new BitSet(new long[]{0x4840000000100000L,0x0000000000080000L});
	public static final BitSet FOLLOW_atom_in_element971 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_ASSIGN_in_element978 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_ID_in_element980 = new BitSet(new long[]{0x4942408000100410L,0x00000000000C64C0L});
	public static final BitSet FOLLOW_element_in_element982 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_PLUS_ASSIGN_in_element989 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_ID_in_element991 = new BitSet(new long[]{0x4942408000100410L,0x00000000000C64C0L});
	public static final BitSet FOLLOW_element_in_element993 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_SET_in_element1003 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_setElement_in_element1005 = new BitSet(new long[]{0x4800000000000008L});
	public static final BitSet FOLLOW_RULE_REF_in_element1017 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_ebnf_in_element1022 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_epsilonElement_in_element1027 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_ACTION_in_epsilonElement1038 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_SEMPRED_in_epsilonElement1043 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_EPSILON_in_epsilonElement1048 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_ACTION_in_epsilonElement1054 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_elementOptions_in_epsilonElement1056 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_SEMPRED_in_epsilonElement1063 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_elementOptions_in_epsilonElement1065 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_STRING_LITERAL_in_setElement1078 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_elementOptions_in_setElement1080 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_TOKEN_REF_in_setElement1087 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_elementOptions_in_setElement1089 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_STRING_LITERAL_in_setElement1095 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_TOKEN_REF_in_setElement1100 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_block_in_ebnf1111 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_OPTIONAL_in_ebnf1123 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_block_in_ebnf1125 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_CLOSURE_in_ebnf1139 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_block_in_ebnf1141 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_POSITIVE_CLOSURE_in_ebnf1155 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_block_in_ebnf1157 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_BLOCK_in_block1177 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_ACTION_in_block1179 = new BitSet(new long[]{0x0000000000000000L,0x0000000000000020L});
	public static final BitSet FOLLOW_alternative_in_block1182 = new BitSet(new long[]{0x0000000000000008L,0x0000000000000020L});
	public static final BitSet FOLLOW_ALT_in_alternative1199 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_elementOptions_in_alternative1201 = new BitSet(new long[]{0x4942408000100410L,0x00000000000C64C0L});
	public static final BitSet FOLLOW_element_in_alternative1204 = new BitSet(new long[]{0x4942408000100418L,0x00000000000C64C0L});
	public static final BitSet FOLLOW_RULE_REF_in_atom1221 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_ARG_ACTION_in_atom1223 = new BitSet(new long[]{0x0000000000000008L,0x0000000000000200L});
	public static final BitSet FOLLOW_elementOptions_in_atom1226 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_STRING_LITERAL_in_atom1238 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_elementOptions_in_atom1240 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_STRING_LITERAL_in_atom1246 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_TOKEN_REF_in_atom1255 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_elementOptions_in_atom1257 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_TOKEN_REF_in_atom1263 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_WILDCARD_in_atom1272 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_elementOptions_in_atom1274 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_WILDCARD_in_atom1280 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_DOT_in_atom1286 = new BitSet(new long[]{0x0000000000000004L});
	public static final BitSet FOLLOW_ID_in_atom1288 = new BitSet(new long[]{0x4942408000100410L,0x00000000000C64C0L});
	public static final BitSet FOLLOW_element_in_atom1290 = new BitSet(new long[]{0x0000000000000008L});
	public static final BitSet FOLLOW_binary_in_synpred1_LeftRecursiveRuleWalker348 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_prefix_in_synpred2_LeftRecursiveRuleWalker404 = new BitSet(new long[]{0x0000000000000002L});
	public static final BitSet FOLLOW_suffix_in_synpred3_LeftRecursiveRuleWalker460 = new BitSet(new long[]{0x0000000000000002L});
}
