package br.com.nosso.codigo.comida.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.nosso.codigo.comida.TestUtil;
import org.junit.jupiter.api.Test;

public class PratoTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Prato.class);
        Prato prato1 = new Prato();
        prato1.id = 1L;
        Prato prato2 = new Prato();
        prato2.id = prato1.id;
        assertThat(prato1).isEqualTo(prato2);
        prato2.id = 2L;
        assertThat(prato1).isNotEqualTo(prato2);
        prato1.id = null;
        assertThat(prato1).isNotEqualTo(prato2);
    }
}
