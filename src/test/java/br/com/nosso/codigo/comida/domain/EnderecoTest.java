package br.com.nosso.codigo.comida.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.nosso.codigo.comida.TestUtil;
import org.junit.jupiter.api.Test;

public class EnderecoTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Endereco.class);
        Endereco endereco1 = new Endereco();
        endereco1.id = 1L;
        Endereco endereco2 = new Endereco();
        endereco2.id = endereco1.id;
        assertThat(endereco1).isEqualTo(endereco2);
        endereco2.id = 2L;
        assertThat(endereco1).isNotEqualTo(endereco2);
        endereco1.id = null;
        assertThat(endereco1).isNotEqualTo(endereco2);
    }
}
