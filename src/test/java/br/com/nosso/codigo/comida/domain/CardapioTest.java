package br.com.nosso.codigo.comida.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.nosso.codigo.comida.TestUtil;
import org.junit.jupiter.api.Test;

public class CardapioTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Cardapio.class);
        Cardapio cardapio1 = new Cardapio();
        cardapio1.id = 1L;
        Cardapio cardapio2 = new Cardapio();
        cardapio2.id = cardapio1.id;
        assertThat(cardapio1).isEqualTo(cardapio2);
        cardapio2.id = 2L;
        assertThat(cardapio1).isNotEqualTo(cardapio2);
        cardapio1.id = null;
        assertThat(cardapio1).isNotEqualTo(cardapio2);
    }
}
